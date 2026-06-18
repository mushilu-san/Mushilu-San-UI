# Security Policy

The maintainer of **@mushilu-san/ui** takes the security of the library and its consumers
seriously. This document explains which versions receive security updates and how to
report a vulnerability responsibly.

## Supported Versions

The library is currently **pre-1.0 and under active development**. Security fixes are
applied only to the latest published version. _[Update this table once a stable release
line exists.]_

| Version              | Supported          |
| -------------------- | ------------------ |
| Latest (`main`)      | :white_check_mark: |
| Older / pre-releases | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, pull
requests, or discussions.**

Report them privately through **GitHub Security Advisories** — the preferred and only
channel:

- Open a private report via **Security → Advisories → Report a vulnerability** on the
  repository:
  <https://github.com/mnmz81/Mushilu-San-UI/security/advisories/new>

To help triage quickly, please include:

- A description of the vulnerability and its potential impact.
- The affected version(s) and environment (Angular version, browser, OS).
- Step-by-step instructions to reproduce the issue.
- A proof-of-concept or exploit code, if available.
- Any suggested mitigation or fix.

## Disclosure Process

After a report is received, you can expect the following:

1. **Acknowledgement** — receipt confirmed within **3 business days**.
2. **Triage** — the report is validated and its severity and affected versions
   determined, with updates shared as progress is made.
3. **Fix & validation** — a fix is developed and tested on a private branch. Target
   resolution times by severity: **critical — 7 days**, **high — 30 days**,
   **medium / low — 90 days**.
4. **Coordinated disclosure** — once a patch is ready, a new release and a GitHub Security
   Advisory are published (and a CVE requested where applicable). Public disclosure is
   targeted within **90 days** of the initial report.
5. **Credit** — with your permission, you will be credited in the advisory and release
   notes. Let me know how you'd like to be acknowledged.

Please give a reasonable opportunity to address the issue before any public disclosure.

## Scope

This policy applies to the latest released version of the `@mushilu-san/ui` package and
this repository. Out of scope: unreleased/experimental branches, demo or example
applications, and third-party dependencies (report those to their respective
maintainers).

## Safe Harbor

Any good-faith security research conducted in accordance with this policy is considered
authorized. I will not pursue or support legal action against researchers who discover and
report vulnerabilities responsibly, provided they avoid privacy violations, data
destruction, and service disruption, and do not access more data than necessary to
demonstrate the issue.
