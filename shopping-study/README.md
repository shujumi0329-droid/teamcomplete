# Shopping Study v4

This package contains the shopping task, product images, and the matching Google Apps Script collector.

## Already configured
- Google Sheet collector URL is already embedded in `index.html`.
- Researcher admin gate: click the `ShopLab` logo.
- Default researcher password: `nsysu0825`.
- The questionnaire URL is stored centrally in `宿命論_Record` via the Apps Script backend.
- Participants are matched using MTurk `assignmentId` as `join_id`.

## One-time Google Apps Script update
Your existing `/exec` deployment currently points to the older collector. Replace the Apps Script project code with `AppsScript_Collector.gs`, then:

1. Apps Script -> Deploy -> Manage deployments.
2. Edit the existing Web app deployment.
3. Version -> New version.
4. Execute as -> Me.
5. Who has access -> Anyone.
6. Deploy.

Keep the same `/exec` URL. The HTML is already wired to it.

## Researcher admin panel
1. Open the shopping site.
2. Click the `ShopLab` logo at top left.
3. Enter password `nsysu0825`.
4. Paste the full questionnaire URL (must start with `https://`).
5. Click `Save for participants`.

The URL is written to `宿命論_Record` -> `Setup` and is loaded by future participants automatically.

## GitHub Pages deployment
Upload the CONTENTS of this folder to the repository path used by GitHub Pages, preserving:

- `index.html`
- `assets/products/p01.webp` ... `p24.webp`

Do not upload only `index.html`; the image folder is required.
