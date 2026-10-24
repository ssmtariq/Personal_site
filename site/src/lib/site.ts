// Formatting helpers shared by the pages. Inputs are already validated by content.config.ts.
import { countryOf, flagUse, withFlags } from './flags';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** "2026-03-17" or "2026-03" → "Mar 2026"; "2026" → "2026". */
export const month = (d: string) => {
  const [y, m] = d.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
};

/** "Jan 2022 – Present" */
export const range = (start: string, end?: string) =>
  `${month(start)} – ${!end || end === 'present' ? 'Present' : month(end)}`;

/** "2022 – Present", "2011 – 2015", or a single year (also when there is no end: a one-off role). */
export const years = (start: string, end?: string) => {
  const a = start.slice(0, 4);
  const b = end === 'present' ? 'Present' : (end ?? start).slice(0, 4);
  return a === b ? a : `${a} – ${b}`;
};

/** Sort key for partial dates: a bare year sorts before the dated items of that year. */
export const dateKey = (d: string) => (d.length === 4 ? `${d}-00` : d);

/** Inline Markdown (**bold**, *italic*) for set:html, with a flag after each country name.
 *  HTML is escaped first, so data cannot inject markup. */
export const inline = (s: string) =>
  withFlags(
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>'),
  );

/** A location such as "Munich, Germany" as HTML, with the country's flag. */
export const place = (location: string) => {
  const code = countryOf(location);
  if (!code) return escape(location);
  const cut = location.lastIndexOf(',') + 1; // the country and its flag never wrap apart
  return `${escape(location.slice(0, cut))}${cut ? ' ' : ''}<span class="place">${escape(location.slice(cut).trim())}${flagUse(code)}</span>`;
};

/** "ACM TACO" 2023 → "TACO '23"; a short name that already carries the year ("SC24") stays as is. */
export const venueTag = (v: { short: string; year: number }) => {
  const s = v.short.replace(/^ACM /, '');
  return /\d{2}$/.test(s) ? s : `${s} '${String(v.year).slice(2)}`;
};

/** "IEEE ICDCS 2025", "ACM TACO 2023", "SC24" */
export const venueName = (v: { short: string; year: number; publisher: string }) => {
  const prefix = ['IEEE', 'ACM'].includes(v.publisher) && !v.short.startsWith(v.publisher) ? `${v.publisher} ` : '';
  return `${prefix}${v.short}${/\d{2}$/.test(v.short) ? '' : ` ${v.year}`}`;
};

/** Count-up only for plain numeric values such as "4.59×", "64%", "335,103", "~170M". */
export const countable = (value: string) => /^(~|up to )?[\d,]+(\.\d+)?(×|%|M)?$/.test(value);

type Venue = { short: string; year: number; full: string; kind: string; publisher: string };
type Pub = { title: string; year: number; status: string; category: string; doi?: string; pages?: string; volume?: string; number?: string; article?: string };

/** BibTeX for published or accepted papers that have a venue; undefined otherwise. */
export function bibtex(p: Pub, authors: string[], v?: Venue) {
  if (!v) return undefined;
  const journal = v.kind === 'journal';
  const family = authors[0].split(' ').at(-1)!.toLowerCase().replace(/[^a-z]/g, '');
  const word = p.title.split(/[\s:]+/).find((w) => w.length > 3)!.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fields: [string, string | undefined][] = [
    ['title', `{${p.title}}`],
    ['author', authors.join(' and ')],
    [journal ? 'journal' : 'booktitle', journal ? v.full : `${v.full} (${v.short} ${v.year})`],
    ['volume', p.volume],
    ['number', p.number],
    ['articleno', p.article],
    ['pages', p.pages],
    ['year', String(p.year)],
    ['publisher', v.publisher === 'other' ? undefined : v.publisher],
    ['doi', p.doi],
    ['note', p.status === 'accepted' ? 'Accepted, to appear' : p.category === 'poster' ? 'Poster' : undefined],
  ];
  const body = fields
    .filter(([, val]) => val)
    .map(([k, val]) => `  ${k.padEnd(9)} = {${val}}`)
    .join(',\n');
  return `@${journal ? 'article' : 'inproceedings'}{${family}${p.year}${word},\n${body}\n}`;
}
