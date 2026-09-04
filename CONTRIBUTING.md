# Writing for the Vitay Help Center

This guide keeps articles consistent — for human editors and for AI-assisted
edits. Mintlify ignores this file (it is not published).

## Audience split (most important rule)

Every article is written for **one** audience. Never mix them, and never
cross-link between them in "Related articles".

- **Recruiters / admins** — logged-in Vitay users. They can navigate the app,
  so articles can reference screens, buttons, and settings.
- **Candidates** — external people who received a *reference request* and use
  the public form to list their references. They have **no Vitay login**. Once
  they submit, their list is locked and the form tells them to contact the
  recruiter.
- **Reference providers** — external people asked to *give* a reference. They
  have **no Vitay login** and see only the email and the reference form.

Candidates and reference providers share the `reference-providers/` section
(folder name kept for URL stability). Their articles describe only what they can
see (the email and the form), and the default answer is: *contact the recruiter
who sent the request — their email is in the message you received.* Each
article in that section opens with a `<Note>` naming which of the two it is for;
the one exception is `link-not-working`, which deliberately covers both because
the fix is identical. Never link a candidate or reference-provider article to
recruiter docs, or vice versa.

The section opens with `start-here`, which disambiguates: "Are you a
recruiter? → go to the recruiter docs", then splits the cards into "I'm the
candidate" and "I was asked to give a reference".

## Page template

```mdx
---
title: "Send a reference request"
description: "One-line summary — drives search and SEO. Always present."
---

Short intro: what this does and who it's for (1–2 sentences).

<Note>Required role / prerequisites.</Note>

<Steps>
  <Step title="Do the first thing">…</Step>
</Steps>

![SCREENSHOT: what to capture — placeholder](/images/placeholder.png)

## Troubleshooting   {/* optional; use <AccordionGroup> for multiple issues */}

## Related articles   {/* same-audience links only */}

<CardGroup cols={2}>
  <Card title="…" href="/…" />
</CardGroup>
```

Section order is always: intro → `<Note>` prerequisites → `<Steps>` →
Troubleshooting (optional) → Related articles.

## Conventions

- **Frontmatter:** every page has a `title` and a meaningful `description`.
  The description is a real sentence, not a keyword list.
- **Tone:** clear, friendly, second person ("you"). Short sentences. No jargon
  the reader wouldn't already know.
- **Screenshots:** text-first. Where a screenshot belongs, leave an explicit
  `![SCREENSHOT: <what to capture> — placeholder]` marker so it's easy to find
  and fill later. Do not ship stale images.
- **Steps:** use `<Steps>`/`<Step>` for anything sequential. One action per step.
- **Source pointers:** for recruiter articles whose behavior is backed by
  specific code, add an HTML comment at the bottom naming the relevant
  frontend component and/or backend model, e.g.
  `{/* source: app reference-requests modal; api app/models/reference_request.rb */}`
  This lets a future check trace doc → code.
- **Links:** use absolute paths like `/candidates-reference-requests/overview`
  (no `.mdx`).

## Adding an article

1. Create the `.mdx` file under the right group folder.
2. Add its slug to the matching group in `docs.json` → `navigation.pages`.
3. Follow the template and the audience rule above.
4. If it replaces an old help.vitay.io article, add a row to the redirect map
   (`REDIRECTS.md`).

## Changelog

`changelog.mdx` is the customer-facing record of product releases. It is **not**
a log of documentation edits.

- **One `<Update>` block per release**, newest first. Props:
  - `label` — the production release date as `Month D, YYYY` (this is the anchor).
  - `description` — a one-line headline for the release.
  - `tags` — optional; e.g. `["Feature"]`, `["Fix"]`, `["Announcement"]`.
  - `rss={{ title, description }}` — **always set this**, so each release is a
    single RSS entry. Without it, Mintlify emits one RSS item per heading.
- **Group changes inside a block** under `### New`, `### Improved`, `### Fixed` —
  include only the groups that have items.
- **Customer-facing only.** New features, improvements, and user-visible fixes,
  written benefit-first in second person. Never list infra, dependency bumps,
  refactors, CI, or internal/demo changes.
- **Never edit past entries** except to fix a factual error; the changelog is a
  historical record.

### How entries get added (release ritual)

Entries are added when a release is prepped — when the `staging → master` PRs for
`api.vitay.io` and `app.vitay.io` are opened. That flow (documented in
`api.vitay.io/CLAUDE.md`) prepares a branch off `main` here, prepends one
`<Update>` block with the customer-facing subset of the release, and opens a PR
to `main`. The PR is the review gate for the wording — it is never auto-merged.
