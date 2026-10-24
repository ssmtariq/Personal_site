#!/usr/bin/env python3
"""Fail if the public CV PDF contains personal data that must stay private (decision D3).

Usage: python3 cv/check_cv.py site/public/cv/Syed_Tariq_CV.pdf   (needs pdftotext from poppler-utils)
make-web-cv.py runs the same check before it writes the PDF, and CI runs it on every build.
"""
import re, subprocess, sys

# Text that must never appear in the public PDF (checked after extraction, whitespace collapsed).
FORBIDDEN = [
    (r'\(?586\)?[\s.-]*480|480[\s.-]*6118|5864806118', 'phone number'),
    (r'Merriman|Westland|48185', 'home address'),
    (r'\bGPA\b|CGPA|4\.0\s*/\s*4\.0|3\.37', 'GPA'),
    (r'probirr@|zhesong@|jinhua@|amiangshu\.bosu@', 'referee email'),
    (r'\bReferences\b', 'references section'),
    (r'365 Retail|SDE at|SDI at|PD at|Epicor|\bfemale\b', 'mentee position or gender'),
    (r'Apr(il)? 2027', 'expected graduation date'),
    (r'knowledge distillation', 'removed skill'),
]


def leaks_in(pdf):
    text = subprocess.run(['pdftotext', '-layout', str(pdf), '-'], capture_output=True, text=True, check=True).stdout
    flat = re.sub(r'\s+', ' ', text)
    return [f'{why}: "{m.group(0)}"' for rx, why in FORBIDDEN for m in [re.search(rx, flat, re.I)] if m]


if __name__ == '__main__':
    found = leaks_in(sys.argv[1])
    if found:
        sys.exit('the CV contains: ' + '; '.join(found))
    print(f'{sys.argv[1]}: no phone number, address, GPA, referee emails, or mentee details')
