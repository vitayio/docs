# Writing for the Vitay Help Center

This guide keeps articles consistent — for human editors and for AI-assisted
edits. Mintlify ignores this file (it is not published).

## Audience split (most important rule)

Every article is written for **one** audience. Never mix them, and never
cross-link between them in "Related articles".

- **Recruiters / admins** — logged-in Vitay users. They can navigate the app,
  so articles can reference screens, buttons, and settings.
- **Reference providers** — external people asked to give a reference. They have
  **no Vitay login** and cannot navigate the app. Their articles describe only
  what they can see (the request email and the reference form), and the default
  answer is: *contact the recruiter who requested the reference — their email is
  in the reference request email you received.*

The reference-provider section (`reference-providers/`) opens with
`start-here`, which disambiguates: "Are you a recruiter? → go to the recruiter
docs."

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
