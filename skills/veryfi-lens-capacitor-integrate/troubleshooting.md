# Troubleshooting

Payload names are the subset in [implementation.md](implementation.md). Do not add a call [parity.md](parity.md) marks absent.

## Camera never opens

| Check | What to do |
|-------|------------|
| Platform | `src/web.ts` does nothing in the browser. Run an iOS or Android build |
| Init arguments | iOS rejects when `credentials` or `settings` is missing. Android substitutes empty objects and still calls `configure` |
| Android document type | `credit_card` and `code` are rejected by `veryfi-lens-sdk`. Expect a Toast and no open |
| iOS presenter | `showCamera` no-ops when `getTopViewController()` is nil |
| Native calls | Do not `await` `veryfiInitLens`, `setLensEventDelegate`, or `showCamera`. They never `call.resolve`. Register `addListener` first. There is no configure-ready signal; `showCamera` right after init is a source gap |
| Camera plist | Add `NSCameraUsageDescription` |

## Events never arrive

`addListener` without `setLensEventDelegate` subscribes to notifications nobody sends. Await the listeners first, then `void` `setLensEventDelegate()` before `void` `veryfiInitLens`, then `void` `showCamera()`. Do not await those three.

Listener names are `veryfiLensClose`, `veryfiLensUpdate`, `veryfiLensError`, `veryfiLensSuccess`. There is no `onVeryfiLens*` name and no `event` string inside the payload.

## Wrong document or no extraction

`documentTypes` and `dataExtractionEngine` choose the behavior. The plugin does not switch binaries.

- `"mobile"` only for `credit_card`, `code`, `barcode`.
- Credit card data stays on device.
- More than one type needs `showDocumentTypes: true`.
- `"custom"` is not an iOS engine value.
- OCR caps versus strips is `ocrType`. Android Full will not open `code`.
- Checks do not gain TIFF on this link.

## Gallery, files, or upload

There is no `showGallery`, `showDocumentBrowser`, or `uploadImages`. `galleryIsOn` and `browseIsOn` are in-camera. Headless is unsupported.

## Retry does nothing or rejects

iOS rejects unless `packageID`, `metadata`, and `imageSourceTag` are all set. The error text still says the package id must be sent. Android uses `packageID` only. Metadata will not change the Android retry.

## `showInfoButton` does nothing or looks blank

Expected if a bool was sent. The setting is a native view. Omit it. This plugin cannot open a host help screen either.

## Local files disappear

Set `autoDeleteLocalResourcesAfterProcessing` false to keep `data` paths. There is no `getFileBase64` and no `clearLensStorage`. Read the path with the host's file API, and delete it yourself.

## Camera stays closed after a hung `await`

The host awaited a native plugin method. That promise does not resolve. Remove the `await`. Use `void` for `setLensEventDelegate`, `veryfiInitLens`, `showCamera`, retry, discard, `shareOCRFeedback`, and `observeAnalyticsEvents`. Keep `await` only on `addListener`. Do not add a fake resolved status. There is still no configure-ready signal after the `void` calls.

## Install

Use the scoped package name. `npx cap sync` after install. Maven env vars `MAVEN_VERYFI_USERNAME` and `MAVEN_VERYFI_PASSWORD` for Android. `minSdkVersion` 23 is the plugin floor.

## Stale README

| README | Source |
|--------|--------|
| `npm install veryfi-lens-capacitor` | `package.json` name `@veryfi/veryfi-lens-capacitor` |
| Docgen lists only init, delegate, camera, four listeners | `definitions.ts` also has retry, discard, share OCR, `observeAnalyticsEvents`, and `veryfiLensAnalytics` |
