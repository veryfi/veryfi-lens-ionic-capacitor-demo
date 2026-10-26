# Suggestions

## Install and size

Install `@veryfi/veryfi-lens-capacitor` and run `npx cap sync`. Do not use the unscoped README name.

If the app is too large, say Remote Models is the native flavor that downloads heavy resources after install, and that a Capacitor variant is planned. Do not change the SPM URL or the Gradle coordinate. Compare a release build with the plugin and without it. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).

Do not demo in the browser. `src/web.ts` is empty.

## Privacy

Leave gallery and iCloud backups off unless every scan should be copied into Photos or iCloud. Leave location and dictate off. Hide the More menu so users cannot turn backups and auto capture back on. On Android that also stops stored preferences from replacing the recipe.

## Extraction

`"api"` for receipts, long receipts, checks, business cards, W-2, and W-9. `"mobile"` for barcodes, and for credit cards and OCR codes only where the binary allows them. `"none"` when the customer calls Process a Document. Tell them which path they must keep, and that there is no base64 helper.

Do not send credit card data to the backend.

## Paid features

Fraud detection and field detection are paid and backend-gated. Do not set the flags and call the feature live. Field detection is also the wrong binary for this plugin.

## Documents this link may not scan

Credit cards and OCR codes on Android: say so before building the screen. W-2, W-9, checks, and long receipts on iOS: the Full SPM package was not unpacked. A detection failure is a support question about models.

Any-Documents: ask support which `anyDocumentTemplate` the account has, including one that does not exist yet. Nutrition facts, US passport, driver license, and prescription labels are shortcuts of that solution.

## Help and files

There is no host help screen. Use the built-in guide or none. Do not set `showInfoButton`.

If they display files after the callback, set `autoDeleteLocalResourcesAfterProcessing` false and read `data` paths themselves.

## Retry and promises

Send `packageID`, `metadata`, and `imageSourceTag` so iOS accepts the call. Android will use the id only. Invoke retry, discard, share, and `observeAnalyticsEvents` with `void`. Do not await them. They never `call.resolve`. There is no configure-ready signal to wait for before `showCamera`.

## What not to suggest

- Headless, Lite, or a Remote Models package today
- `showGallery`, `uploadImages`, or `getFileBase64` until the plugin exports them
- `"custom"` extraction
- Editing the plugin repository from the host task
