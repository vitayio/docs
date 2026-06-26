# HelpScout → Mintlify Redirect Mapping

This file records the intended redirect mapping from Vitay's legacy HelpScout knowledge base
(articles at `https://vitay.io/article/<NN>-<slug>`) to the new Mintlify documentation site.
**This file is the mapping only — not the implementation.** The actual redirects still need to be
wired in two places:

1. **HelpScout side** — configure 301 redirects in the HelpScout Beacon / Docs portal so old
   article URLs forward to the new Mintlify paths.
2. **Mintlify `redirects` config** — add entries to `mint.json` (or equivalent) so that any
   inbound links hitting the Mintlify domain under legacy paths are forwarded to the canonical
   new paths.

---

## Category: Admins — Configuration
_(https://help.vitay.io/category/7-admins---configuration)_

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/43-add-users | Adding or removing a user | /account-configuration/manage-users | written |
| https://vitay.io/article/27-can-i-upload-files-and-resumes-to-the-candidates-profile | Can I upload files and resumes to the candidates profile? | DROPPED | dropped (obsolete) |
| https://vitay.io/article/56-how-to-change-the-assigned-recruiter | Changing the assigned recruiter for a candidate/reference | /account-configuration/manage-users | written |
| https://vitay.io/article/75-create-question-sets | Creating or editing a question set | /account-configuration/question-sets-and-templates | written |
| https://vitay.io/article/33-unlocking-user-accounts | Forgot password or unlocking user accounts | /getting-started/logging-in | written |
| https://vitay.io/article/58-how-to-bulk-upload-candidates | Importing or bulk candidates upload | /reports-lead-generation/bulk-candidate-upload | written |
| https://vitay.io/article/76-lead-generation | Lead Generation | /reports-lead-generation/lead-generation | written |
| https://vitay.io/article/72-managing-subaccounts | Managing sub accounts | /account-configuration/manage-users | written |
| https://vitay.io/article/26-notification-set-up-for-completed-references-leads-feedbacks | Notification set-up for completed references, feedbacks or leads | /account-configuration/notification-settings | written |
| https://vitay.io/article/16-settings-configuration | Settings - Configuration | /account-configuration/manage-users | written |
| https://vitay.io/article/45-emails | Settings - Emails | /account-configuration/email-sender-settings | written |
| https://vitay.io/article/54-settings-plugins | Settings - General and Plugins | /integrations/overview | written |
| https://vitay.io/article/19-settings-notification | Settings - Notification | /account-configuration/notification-settings | written |
| https://vitay.io/article/44-settings-ref-requests | Settings - Ref. Requests | /candidates-reference-requests/send-a-reference-request | written |
| https://vitay.io/article/15-text-messages | Settings - Texts | /account-configuration/notification-settings | written |
| https://vitay.io/article/38-settings-white-label | Settings - White Label | /account-configuration/branding-white-label | written |
| https://vitay.io/article/70-changing-user-roles | Updating user roles | /account-configuration/manage-users | written |

---

## Category: Candidates and References
_(https://help.vitay.io/category/4-candidates-and-references)_

> Note: this old category mixed recruiter-facing and reference-provider-facing content. Articles
> addressed TO the reference provider (person filling out the form) are mapped to `/reference-providers/*`.

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/25-reference-request-link-not-working | Reference request link not working | /reference-providers/link-not-working | written |
| https://vitay.io/article/31-my-reference-is-not-receiving-the-email | My reference is not receiving the email | /reference-providers/reference-not-receiving-email | written |
| https://vitay.io/article/48-how-to-pick-dates | How to pick dates | /reference-providers/start-here | stub |
| https://vitay.io/article/40-email-is-invalid | Email is invalid | /reference-providers/change-reference-email | written |
| https://vitay.io/article/46-reminders-hiw | Reminders and how it works | /candidates-reference-requests/reminders-and-cadence | written |
| https://vitay.io/article/30-how-to-provide-a-new-reference | Providing a new reference | /reference-providers/start-here | written |
| https://vitay.io/article/37-how-to-change-or-update-a-reference-email | Editing my reference email | /reference-providers/change-reference-email | written |
| https://vitay.io/article/49-how-can-i-see-or-get-a-copy-of-my-reference-responses | Requesting a copy of my response or reference(s) response | /reference-providers/edit-my-answers | stub |
| https://vitay.io/article/35-reminder-you-have-been-requested-as-a-reference-for | Reminder: you have been requested as a reference for a user | /reference-providers/start-here | written |
| https://vitay.io/article/55-how-to-contact-my-recruiter | How to contact the recruiter | /reference-providers/start-here | stub |
| https://vitay.io/article/23-unable-to-submit-my-reference | Unable to submit my reference form | /reference-providers/link-not-working | written |
| https://vitay.io/article/22-changing-my-answers-for-my-filled-reference-form | Editing my answers for my filled reference form | /reference-providers/edit-my-answers | written |
| https://vitay.io/article/53-i-do-not-know-this-reference | Unknown reference request | /reference-providers/unknown-reference-request | written |
| https://vitay.io/article/24-reference-request-id-not-found | Reference Request ID not found | /reference-providers/link-not-working | written |
| https://vitay.io/article/51-i-am-unable-to-type-answers-or-fill-in-certain-fields | Difficulty typing answers or fill in certain fields | /security-it/browser-support | written |

---

## Category: Recruiters & Supervisors
_(https://help.vitay.io/category/5-recruiters-supervisors)_

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/57-how-to-search-for-past-references | Searching for past reference(s) | /candidates-reference-requests/search-past-references | written |
| https://vitay.io/article/18-add-references | Adding a reference manually | /candidates-reference-requests/add-a-reference-manually | written |
| https://vitay.io/article/42-automatically-assigning-question-sets | Automatically assigning question sets | /account-configuration/question-sets-and-templates | written |
| https://vitay.io/article/17-send-reference-requests | Initiating a reference request | /candidates-reference-requests/send-a-reference-request | written |
| https://vitay.io/article/34-ip-conflicts | IP conflicts | /security-it/data-and-privacy | written |
| https://vitay.io/article/13-lead-customer-wants-to-be-contacted | For Staffing and Recruiting Companies | /reports-lead-generation/lead-generation | written |
| https://vitay.io/article/29-turn-of-reminders-for-specific-references | Turn off reminders for specific candidates/references | /candidates-reference-requests/reminders-and-cadence | written |
| https://vitay.io/article/52-reference-link-not-working | Reference Request Link not working (2) | /candidates-reference-requests/reference-not-received | written |

---

## Category: Plug-ins
_(https://help.vitay.io/category/11-plug-ins)_

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/50-background-screening | Background screening | /integrations/overview | stub |
| https://vitay.io/article/47-reference-signature | Candidate and Reference signature | /account-configuration/question-sets-and-templates | stub |
| https://vitay.io/article/12-pre-screening | Pre-screening | /integrations/overview | stub |
| https://vitay.io/article/36-white-label | White label | /account-configuration/branding-white-label | written |

---

## Category: Feedback
_(https://help.vitay.io/category/10-feedback)_

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/28-candidate-feedback | Candidate Post Hire Feedback | /feedback/candidate-feedback | written |
| https://vitay.io/article/21-employer-feedback | Employer feedback | /feedback/post-hire-feedback | written |
| https://vitay.io/article/41-recruiter-feedback | Recruiter feedback | /feedback/post-hire-feedback | written |

---

## Category: IT Related
_(https://help.vitay.io/category/9-it-related)_

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/39-configuring-email-sender-settings | Configuring email sender settings | /account-configuration/email-sender-settings | written |
| https://vitay.io/article/32-multi-factor-authentication-and-other-login-options | Multi-factor authentication and other login options | /getting-started/mfa-and-login-options | written |
| https://vitay.io/article/59-integrations | Integrations - HIW and what's required | /integrations/overview | written |

---

## Category: Reports and Uploads
_(https://help.vitay.io/category/8-reports-and-uploads)_

| Old URL | Old Title | New Path | Status |
|---|---|---|---|
| https://vitay.io/article/62-how-to-download-reports | Download and Export reports | /reports-lead-generation/download-reports | written |

---

## Category: Lead Generation
_(https://help.vitay.io/category/6-lead-generation)_

> The HelpScout category page listed no articles ("No articles were found in this category").
> Lead generation content is covered via articles in the Admins and Recruiters categories above.

_(No articles to map.)_

---

## Summary

| Metric | Count |
|---|---|
| Total old articles enumerated | 51 |
| Mapped to **written** pages | 38 |
| Mapped to **stub** pages | 7 |
| **Dropped** | 1 |
| Lead Generation category (empty) | 0 |

### Dropped articles

| Old URL | Reason |
|---|---|
| https://vitay.io/article/27-can-i-upload-files-and-resumes-to-the-candidates-profile | obsolete — file/resume upload is not a Mintlify doc topic |

### Articles mapped to stubs (may need content before go-live)

| Old URL | Old Title | Mapped To |
|---|---|---|
| https://vitay.io/article/48-how-to-pick-dates | How to pick dates | /reference-providers/start-here |
| https://vitay.io/article/49-how-can-i-see-or-get-a-copy-of-my-reference-responses | Requesting a copy of my response or reference(s) response | /reference-providers/edit-my-answers |
| https://vitay.io/article/55-how-to-contact-my-recruiter | How to contact the recruiter | /reference-providers/start-here |
| https://vitay.io/article/50-background-screening | Background screening | /integrations/overview |
| https://vitay.io/article/47-reference-signature | Candidate and Reference signature | /account-configuration/question-sets-and-templates |
| https://vitay.io/article/12-pre-screening | Pre-screening | /integrations/overview |
| https://vitay.io/article/15-text-messages | Settings - Texts | /account-configuration/notification-settings |
