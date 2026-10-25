// Content collections for ssmtariq.github.io (spike of the planned schema).
// Every YAML file in content/ is an array of entries; each entry needs a unique kebab-case `id`
// and a `source` string that records where the fact came from (never rendered).
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------- shared field types ----------
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DOI = /^10\.\d{4,9}\/\S+$/;

// YAML may hand us a Date (unquoted 2026-03-17) or a number (unquoted 2025); normalize to text first.
const dateish = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === 'number' ? String(v) : v),
  z.string().regex(/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/, 'use YYYY, YYYY-MM, or YYYY-MM-DD'),
);
const endDate = z.union([z.literal('present'), dateish]);
const href = z
  .string()
  .refine((s) => /^https:\/\//.test(s) || s.startsWith('/'), 'use an https:// URL or a site path starting with /');
const source = z.string().min(3, 'record where this fact comes from (e.g. "CV final p.2; 02B item 7")');
const md = z.string(); // inline Markdown; rendered without raw HTML
const image = z.object({ src: z.string(), alt: z.string().min(5, 'alt text must describe the image'), credit: z.string().optional() });
const term = z.object({ season: z.enum(['Winter', 'Summer', 'Fall']), year: z.number().int().min(2000).max(2100) });

const base = { source, hidden: z.boolean().default(false), notes: z.string().optional() };

// ---------- registries ----------
const people = defineCollection({
  loader: file('content/people.yaml'),
  schema: z.object({
    name: z.string(),
    me: z.boolean().default(false),
    aliases: z.array(z.string()).default([]),
    affiliation: z.string().optional(),
    url: href.optional(),
    ...base,
  }),
});

const venues = defineCollection({
  loader: file('content/venues.yaml'),
  schema: z.object({
    short: z.string(), // e.g. "SANER"
    year: z.number().int(),
    full: z.string(),
    kind: z.enum(['conference', 'journal', 'poster-track', 'workshop', 'symposium', 'preprint-server']),
    publisher: z.enum(['IEEE', 'ACM', 'USENIX', 'Springer', 'Elsevier', 'arXiv', 'other']),
    location: z.string().optional(),
    dates: z.object({ start: dateish, end: dateish.optional() }).optional(),
    url: href.optional(),
    // Stored for completeness; rendered only if site.flags.showVenueMetrics is true.
    metrics: z
      .object({ acceptance_rate: z.string().optional(), core_rank: z.string().optional(), quartile: z.string().optional(), impact_factor: z.string().optional() })
      .optional(),
    ...base,
  }),
});

// ---------- research ----------
const projects = defineCollection({
  loader: glob({ base: './content/projects', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string().max(140),
    layer: z.enum(['software-lifecycle', 'system-stack', 'distributed-services', 'control-plane', 'software-evolution']),
    status: z.enum(['published', 'ongoing', 'in-preparation']),
    years: z.object({ start: z.number().int(), end: z.number().int().optional() }),
    role: md,
    order: z.number().int(),
    publications: z.array(reference('publications')).default([]),
    results: z
      .array(
        z.object({
          value: z.string(), // "4.59×", "335,103"
          label: z.string(),
          featured: z.boolean().default(false), // shown on the home page (else the first two)
          source: z.object({ publication: reference('publications'), locator: z.string() }), // every number cites paper + page
        }),
      )
      .default([]),
    artifacts: z.array(z.object({ label: z.string(), url: href, doi: z.string().regex(DOI).optional(), kind: z.enum(['code', 'dataset', 'benchmark', 'replication-package']) })).default([]),
    figures: z.array(image.extend({ caption: z.string() })).default([]),
    ...base,
  }),
});

const publications = defineCollection({
  loader: file('content/publications.yaml'),
  schema: ({ image: img }) => z
    .object({
      title: z.string(),
      authors: z
        .array(z.object({ person: reference('people'), equal: z.boolean().default(false), corresponding: z.boolean().default(false) }))
        .min(1),
      venue: reference('venues').optional(), // omit for manuscripts
      target_venue: z.string().optional(), // manuscripts only: "The ACM Web Conference (WWW 2027)"
      year: z.number().int(),
      status: z.enum(['published', 'accepted', 'in-press', 'under-review', 'in-preparation', 'preprint']),
      category: z.enum(['conference', 'journal', 'poster', 'manuscript', 'thesis', 'earlier']),
      role: z.enum(['first-author', 'co-first-author', 'co-author']),
      doi: z.string().regex(DOI, 'DOI must look like 10.xxxx/...').optional(),
      pages: z.string().optional(),
      volume: z.string().optional(),
      number: z.string().optional(),
      article: z.string().optional(),
      abstract: z.string().optional(),
      topics: z.array(z.enum(['serverless', 'microservices', 'performance-analysis', 'empirical-se', 'mining-software-repositories', 'configuration-tuning', 'llm-methods', 'earlier-work'])).default([]),
      contribution: md.optional(), // what *I* did, worded within the sources
      project: reference('projects').optional(),
      selected: z.boolean().default(false),
      links: z
        .object({ pdf: href.optional(), arxiv: href.optional(), slides: href.optional(), video: href.optional(), code: href.optional(), poster: href.optional(), proceedings: href.optional() })
        .default({}),
      artifact: z.object({ label: z.string(), url: href, doi: z.string().regex(DOI).optional() }).optional(),
      teaser: z.object({ src: img(), alt: z.string().min(5), caption: z.string(), credit: z.string().min(5, 'figures from papers need a credit line (D13)') }).optional(),
      copyright_notice: z.string().optional(),
      ...base,
    })
    .superRefine((p, ctx) => {
      const issue = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message });
      if (p.category === 'earlier' && p.selected) issue('selected', 'earlier publications can never be selected/featured');
      if (p.category === 'earlier' && p.topics.some((t) => t !== 'earlier-work')) issue('topics', 'earlier publications may only use the earlier-work topic');
      if (p.status === 'published' && !p.doi && !p.links.proceedings) issue('doi', 'published entries need a DOI or a proceedings link');
      if (p.status === 'in-preparation' && (p.venue || p.doi)) issue('venue', 'manuscripts in preparation take target_venue only, never a venue or DOI');
      if (['published', 'accepted'].includes(p.status) && ['conference', 'journal'].includes(p.category) && !p.abstract)
        issue('abstract', 'published/accepted papers need the author-written abstract (Google Scholar requires it)');
      if (p.links.pdf?.startsWith('/') && p.venue === undefined) issue('links', 'self-hosted PDFs need a venue for the citation tags');
    }),
});

const talks = defineCollection({
  loader: file('content/talks.yaml'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['conference-talk', 'invited-talk', 'guest-lecture', 'poster', 'seminar', 'workshop', 'panel']),
    event: z.string(),
    location: z.string(),
    date: dateish,
    presented_by_me: z.literal(true, 'list only talks you gave yourself'),
    publication: reference('publications').optional(),
    award: reference('awards').optional(),
    course: z.string().optional(),
    audience: z.number().int().positive().optional(), // class or audience size, when known
    earlier: z.boolean().default(false),
    links: z.object({ slides: href.optional(), video: href.optional(), poster: href.optional(), event: href.optional() }).default({}),
    ...base,
  }),
});

// ---------- updates ----------
const news = defineCollection({
  loader: file('content/news.yaml'),
  schema: z.object({
    date: dateish,
    kind: z.enum(['paper', 'talk', 'award', 'service', 'teaching', 'milestone', 'mentoring', 'media', 'other']),
    headline: md.refine((s) => s.length <= 160, 'keep headlines to 160 characters'),
    links: z.array(z.object({ label: z.string(), url: href })).default([]),
    refs: z.object({ publication: reference('publications').optional(), talk: reference('talks').optional(), award: reference('awards').optional() }).default({}),
    pinned: z.boolean().default(false),
    expires: dateish.optional(),
    ...base,
  }),
});

// ---------- teaching & mentoring ----------
const teaching = defineCollection({
  loader: file('content/teaching.yaml'),
  schema: z
    .object({
      course: z.object({ code: z.string().optional(), title: z.string(), level: z.enum(['undergraduate', 'graduate', 'mixed']), cross_list: z.string().optional() }),
      institution: z.string(),
      program: z.string().optional(), // e.g. "ESIEA exchange program"
      term,
      role: z.enum(['instructor-of-record', 'lab-instructor', 'teaching-assistant', 'guest-lecturer', 'co-instructor']),
      students: z.number().int().positive(),
      length: z.string().optional(), // "4 weeks"
      modality: z.array(z.enum(['in-person', 'online-async', 'online-optional', 'hybrid'])).min(1),
      responsibilities: z.array(z.string()).default([]),
      materials: md.optional(),
      evaluation: z
        .object({
          instrument: z.string(),
          item: z.string(), // "Overall instructor"
          score: z.number(),
          scale: z.number(),
          dept_mean: z.number().optional(),
          college_mean: z.number().optional(),
          university_mean: z.number().optional(),
          responses: z.number().int().optional(), // decision D5: never displayed
          enrolled: z.number().int(),
          quotes: z.array(z.string()).default([]),
          document: href.optional(),
          public_document: z.boolean().default(false),
        })
        .optional(),
      ...base,
    })
    .superRefine((t, ctx) => {
      const e = t.evaluation;
      if (!e) return;
      if (e.responses !== undefined && e.responses > e.enrolled) ctx.addIssue({ code: 'custom', path: ['evaluation', 'responses'], message: 'responses cannot exceed enrolled' });
      if (e.enrolled !== t.students) ctx.addIssue({ code: 'custom', path: ['evaluation', 'enrolled'], message: `enrolled (${e.enrolled}) disagrees with students (${t.students})` });
      if (e.score > e.scale) ctx.addIssue({ code: 'custom', path: ['evaluation', 'score'], message: 'score exceeds scale' });
    }),
});

// Decision D10: mentees' names and current positions stay off the site (and out of this public repo).
const mentoring = defineCollection({
  loader: file('content/mentoring.yaml'),
  schema: z.object({
    name: z.undefined('decision D10: mentee names stay off the site').optional(),
    current_position: z.undefined('decision D10: mentee positions stay off the site').optional(),
    level: z.enum(['undergraduate', 'masters', 'phd']),
    program: z.string(),
    start: dateish,
    end: endDate,
    project: reference('projects').optional(),
    outcome: md,
    publications: z.array(reference('publications')).default([]),
    ...base,
  }),
});

// ---------- service, experience, education, recognition ----------
const service = defineCollection({
  loader: file('content/service.yaml'),
  schema: z.object({
    category: z.enum(['artifact-evaluation', 'reviewing', 'program-committee', 'organizing', 'leadership', 'outreach', 'membership', 'departmental']),
    role: z.string(),
    organization: z.string(),
    short: z.string().optional(), // "OSDI"
    start: dateish,
    end: endDate.optional(),
    location: z.string().optional(),
    details: z.array(md).default([]),
    url: href.optional(),
    ...base,
  }),
});

const experience = defineCollection({
  loader: file('content/experience.yaml'),
  schema: ({ image: img }) => z.object({
    kind: z.enum(['academic', 'industry']),
    organization: z.string(),
    role: z.string(),
    start: dateish,
    end: endDate,
    location: z.string(),
    logo: img().optional(),
    bullets: z.array(md).max(4, 'keep each role to at most 4 bullets'),
    // Distinct duties inside the role (an exchange program, a recruitment program); `when` overrides the dates shown.
    subroles: z
      .array(z.object({ role: z.string(), start: dateish, end: endDate.optional(), when: z.string().optional(), bullets: z.array(md).min(1).max(3) }))
      .default([]),
    ...base,
  }),
});

const education = defineCollection({
  loader: file('content/education.yaml'),
  schema: ({ image: img }) => z.object({
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
    unit: z.string().optional(),
    start: dateish,
    end: dateish,
    expected: z.boolean().default(false),
    location: z.string(),
    advisor: z.string().optional(),
    dissertation: z.object({ title: z.string(), proposal_passed: dateish.optional() }).optional(),
    committee: z.array(z.object({ name: z.string(), role: z.string().optional() })).default([]),
    honors: z.array(z.string()).default([]),
    logo: img().optional(),
    ...base,
  }),
});

const awards = defineCollection({
  loader: file('content/awards.yaml'),
  schema: ({ image: img }) => z.object({
    title: z.string(),
    organization: z.string(),
    year: z.number().int(),
    category: z.enum(['honor', 'best-paper', 'best-poster', 'fellowship', 'scholarship', 'travel-grant', 'research-grant', 'recognition']),
    purpose: md.optional(),
    team: z.boolean().default(false),
    location: z.string().optional(),
    evidence: z.object({ src: img(), alt: z.string().min(5) }).optional(), // certificate shown in a lightbox
    ...base,
  }),
});

const certifications = defineCollection({
  loader: file('content/certifications.yaml'),
  schema: ({ image: img }) => z.object({
    title: z.string(),
    issuer: z.string(),
    date: dateish,
    category: z.enum(['research-ethics', 'technical', 'professional', 'compliance']),
    detail: z.string().optional(),
    credential_id: z.string().optional(),
    evidence: z.object({ src: img(), alt: z.string().min(5) }).optional(), // certificate shown in a lightbox
    show: z.boolean(),
    ...base,
  }),
});

// ---------- profile, site, misc ----------
const profile = defineCollection({
  loader: file('content/profile.yaml'),
  schema: ({ image: img }) => z.object({
    name: z.object({ full: z.string(), given: z.string(), family: z.string() }),
    title: z.string(),
    department: z.string(),
    institution: z.string(),
    advisor: z.string(),
    advisor_url: href.optional(),
    expected_graduation: dateish,
    identity: z.string().max(200, 'keep the identity sentence to about 25 words'),
    bio: md,
    research_areas: z.array(z.string()).min(3).max(8),
    email: z.string().email(),
    location: z.string().optional(),
    links: z.object({ scholar: href, github: href, linkedin: href, orcid: href.optional(), dblp: href.optional() }),
    headshot: z.object({ src: img(), alt: z.string().min(5) }),
    job_market: z.object({ active: z.boolean(), season: z.string(), until: dateish, label: z.string().max(70) }),
    ...base,
  }),
});

const site = defineCollection({
  loader: file('content/site.yaml'),
  schema: z.object({
    title: z.string(),
    url: href,
    flags: z.object({
      showVenueMetrics: z.boolean(),
      visitorStats: z.boolean(),
      showGpa: z.literal(false, 'GPAs stay off the site'),
      showExpectedGraduation: z.boolean().default(false),
      showMentoring: z.boolean().default(false),
    }),
    analytics: z.object({ goatcounter: z.string().regex(KEBAB).optional(), launched: dateish.optional() }),
    ...base,
  }),
});

const skills = defineCollection({
  loader: file('content/skills.yaml'),
  schema: z.object({ label: z.string(), items: z.array(z.string()).min(1), order: z.number().int(), ...base }),
});

const writing = defineCollection({
  loader: file('content/writing.yaml'),
  schema: ({ image: img }) => z.object({ title: z.string(), url: href, date: dateish, platform: z.string(), image: z.object({ src: img(), alt: z.string().min(5) }).optional(), ...base }),
});

const materials = defineCollection({
  loader: file('content/materials.yaml'),
  schema: z.object({
    label: z.string(),
    file: href.optional(),
    updated: dateish,
    status: z.enum(['available', 'coming-soon', 'private']),
    ...base,
  }),
});

// Photos are discovered from content/gallery/; entries here add alt text, captions, dates, and places.
const gallery = defineCollection({
  loader: file('content/gallery.yaml'),
  schema: z.object({
    file: z.string().regex(/^[\w.-]+\.(jpe?g|png|webp|avif)$/i, 'a file name inside content/gallery/, e.g. saner-2026.jpg'),
    alt: z.string().min(5, 'alt text must describe the photo'),
    caption: z.string().optional(),
    date: dateish.optional(),
    location: z.string().optional(),
    order: z.number().int().positive().optional(), // position in the gallery; photos without one follow, newest first
    ...base,
  }),
});

export const collections = {
  people, venues, projects, publications, talks, news, teaching, mentoring, service,
  experience, education, awards, certifications, profile, site, skills, writing, materials, gallery,
};
