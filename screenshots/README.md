# Help-center screenshots

Every screenshot in the help center is captured by this script from a live
Vitay environment (staging by default). Nobody takes them by hand. That keeps
them consistent (same browser size, same demo firm, no "Env: dev" badge or
loading spinners) and lets us re-take all of them after a UI change with one
command.

## How it fits together

- `manifest/*.json` lists each screenshot: the article it belongs to, which app
  and page to open, who to log in as, what to click first, and which element to
  crop to.
- Articles carry a placeholder naming the manifest id until the image exists:
  `![SCREENSHOT(manage-users-list): The Users page](/images/placeholder.png)`
- `npm run capture` writes `../images/screens/<id>.png` for every entry.
- `npm run apply` swaps each placeholder for its image. After that, re-running
  `capture` refreshes the images in place; the articles don't change.
- `npm run check` reports placeholders without a manifest entry, unused entries
  and duplicate ids.

## One-time setup: the docs firm on staging

Screenshots show whatever is in the firm, so use a firm that exists only for
this and looks like a real customer. `bundle exec rake test_accounts:setup` in
`api.vitay.io` creates one ("Acme Technologies Inc", with sub-accounts,
candidates and completed references). Run it on staging, then:

- Give the root user (John Smith) and a plain recruiter (Sarah Johnson) new
  passwords. Neither may have an MFA factor enrolled.
- Pick one candidate with completed references; its id is `DOCS_CANDIDATE_ID`,
  and one of its completed references is `DOCS_REFERENCE_ID`. Send it a
  pre-screening and complete it; that is `DOCS_PRE_SCREENING_ID`.
- Upload a logo and set brand colors so pages don't look empty.
- Leave the firm alone afterwards. Changing its settings changes the screenshots.

Some manifest entries list extra data in `needs` (for example a connected
integration or a pending approval). Set that up before capturing those entries.

## Running

```sh
cd screenshots
npm ci
npx playwright install chromium
export DOCS_ROOT_EMAIL=… DOCS_ROOT_PASSWORD=…
export DOCS_RECRUITER_EMAIL=… DOCS_RECRUITER_PASSWORD=…
export DOCS_CANDIDATE_ID=… DOCS_REFERENCE_ID=… DOCS_PRE_SCREENING_ID=…
export DOCS_INBOX=qa@vitay.io            # staging sends real email
npm run capture                          # all entries
npx playwright test -g manage-users      # just matching ids
npm run apply
```

Then look at every changed image in `git diff` before committing. A capture
that "worked" can still show the wrong state.

Public-form entries (`public-candidate`, `public-referee`) create a throwaway
candidate with a fresh link each run and move it to the recycle bin afterwards.

When an entry fails, `npx playwright show-report` has a trace showing the page
at each step. The usual cause is a selector that changed in the app; fix it in
the manifest.

## Adding a screenshot

1. Add an entry to the matching `manifest/<section>.json`.
2. Put the placeholder in the article where the image belongs.
3. Capture that entry, check it, `npm run apply`, commit the image and article.
