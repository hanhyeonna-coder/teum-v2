# MALHAEBA — Public Launch Checklist

Last updated: 2026-09-25

This file is the source of truth for the final pre-launch pass. Do not enable paid/external services early unless they are needed for testing.

## 1. Core product QA — do before spending money
Owner: ChatGPT + user device test

- [ ] Home → text story → privacy → matching → feed works on iPhone Safari.
- [ ] Home → voice story → review → privacy → matching → feed works on iPhone Safari.
- [ ] Repeat the same core flow on Android Chrome before public launch.
- [ ] Public stories appear in same-language feed only.
- [ ] Private stories stay visible only in My records.
- [ ] Reaction, comment, bookmark and unbookmark all persist after refresh.
- [ ] Report and block work, and blocked authors disappear from feed.
- [ ] My records: own/saved tabs persist and new-comment N badge behaves correctly.
- [ ] Refresh restores stable page; write/review/privacy draft text survives refresh.
- [ ] Korean/English switch does not leave Korean-only UI.
- [ ] Account linking succeeds end-to-end on one device.
- [ ] Existing linked account can sign in on another device.
- [ ] After sign-in, refresh/browser reopen keeps the session.
- [ ] Analytics records both visit and story_created; source tags (?src=instagram etc.) are preserved.
- [ ] No dead menu items or “coming later” actions remain.

## 2. Buy/connect only when core QA is green
Owner: user purchase, ChatGPT setup

### Domain
- [ ] Buy the agreed MALHAEBA domain.
- [ ] Connect it to Vercel.
- [ ] Wait for DNS + HTTPS to resolve.
- [ ] Update Supabase Site URL and allowed redirect URLs.
- [ ] Retest account-link and login links on the final domain.

### Auth email / SMTP
- [ ] Configure Resend custom SMTP for Supabase Auth.
- [ ] Verify sending domain DNS (SPF/DKIM; DMARC as appropriate).
- [ ] Set sender name/address for MALHAEBA.
- [ ] Replace default confirmation + magic-link email templates with MALHAEBA copy/design.
- [ ] Increase Supabase Auth email rate limit only to a sensible level for expected traffic.
- [ ] Test confirmation/login email on Gmail and at least one other provider.
- Planned starting tier: Resend Free, then upgrade only when usage requires it.

### Voice transcription
- [ ] Fund the agreed STT API with the smallest practical prepaid amount; auto-reload off initially.
- [ ] Replace browser SpeechRecognition flow with MediaRecorder → server endpoint → STT.
- [ ] Enforce 5-minute limit server-side as well as client-side.
- [ ] Enforce file-size/MIME/rate limits.
- [ ] Do not persist raw audio unless the product explicitly decides to.
- [ ] Verify there is no browser/system recognition start/end sound from the old flow.
- [ ] Retest Korean + English transcription on iPhone Safari and Android Chrome.

## 3. Abuse/security before public traffic
Owner: ChatGPT setup + user final check

- [ ] Wire Cloudflare Turnstile token into anonymous sign-in first.
- [ ] Only after the frontend token path works, enable CAPTCHA in Supabase.
- [ ] Test fresh anonymous session after CAPTCHA is enabled.
- [ ] Test rate-limit/error states without locking legitimate users out.
- [ ] Recheck RLS on posts, comments, reactions, bookmarks, reports, blocks, analytics_events.
- [ ] Confirm publishable key only is in frontend; no service-role/API secret in GitHub.

## 4. Privacy / terms
Owner: ChatGPT draft; user approves operator/contact details

- [ ] Finalize Privacy Policy from LEGAL_DRAFTS.md.
- [ ] Finalize Terms / Community Rules from LEGAL_DRAFTS.md.
- [ ] Replace temporary Vercel URL with final domain.
- [ ] Update voice-processing disclosure after STT provider is connected.
- [ ] Add final operator/contact information.
- [ ] Link policies from the app before launch.
- [ ] Make clear MALHAEBA is not an emergency, medical, or crisis service.

## 5. Measurement and beta release
Owner: ChatGPT + user

- [ ] Clear any test analytics if we decide production metrics should start clean.
- [ ] Prepare channel URLs: ?src=instagram, ?src=threads, ?src=facebook, ?src=friend.
- [ ] Recruit first 20–30 genuinely unknown users before more feature polishing.
- [ ] Primary validation: visit → story_created conversion.
- [ ] Secondary validation: return usage, comments/reactions/bookmarks, and repeat story creation.
- [ ] Collect qualitative feedback only after observing actual behavior.

## Do not forget
- Threads @malhaeba account must be fully recovered/usable before relying on it as an acquisition channel.
- Supabase built-in SMTP is test-only and currently rate-limited; do not launch publicly on it.
- Final domain, SMTP, and STT changes can affect auth/voice flows, so leave several days for regression testing rather than changing them hours before launch.
- Re-check current prices and service limits immediately before any purchase.
