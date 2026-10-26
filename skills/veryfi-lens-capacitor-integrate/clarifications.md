# Clarifications

Conservative default: leave the key out or use the base recipe. Do not present Unconfirmed behavior as a contract.

## Resolved for this plugin

| Topic | What to do |
|-------|------------|
| Package name | `@veryfi/veryfi-lens-capacitor`, not `veryfi-lens-capacitor` |
| Contract | `src/definitions.ts`, not the README docgen index |
| Web | `src/web.ts` is a no-op |
| Delegate | `setLensEventDelegate` assigns it. `veryfiInitLens` does not |
| Engine strings | `api`, `mobile`, `none`. README-style `"custom"` is not an iOS decoder value |
| Help | No help event and no host help screen |
| Info view | Do not set `showInfoButton`. JSON is not a `VeryfiInfoView` |
| Gallery | `galleryIsOn` inside the camera. No `showGallery` |
| Files | No base64 helper. Paths are in update `data` |
| Retry | iOS needs three fields. Android reads `packageID` only |

## Unconfirmed

| Item | What was read | Status |
|------|----------------|--------|
| Promise settlement | Native methods do not `call.resolve`. iOS rejects only specific missing fields. Android does not reject | Do not await them. No configure-ready signal. `showCamera` immediately after init is a source gap |
| Models in `veryfi-lens-spm.git` from `3.0.16` | Package URL and version only. Not unpacked | Do not claim credit-card, code, check, W-2, or W-9 models |
| Android `initWithJsonObject` for every recipe key | The map is forwarded. Each key was not re-read in the Android SDK for this pack | A key absent from plugin samples may be ignored |
| `ocrType`, `continuousAutoFocus` on Android | iOS reads them | **Unconfirmed** on Android |
| `showInfoButton` bool on Android | No special case in the Java plugin | **Unconfirmed**. Omit the key |
| Second `initWithJsonObject` call in Android `veryfiInitLens` | Called inside the try and again after the catch | **Unconfirmed** if the second call throws |
| `ios/Plugin` versus `ios/Sources` | SPM uses `ios/Sources` | Do not document `ios/Plugin` as the host bridge |
| `isReactNative` | Leave unset. This is not the React Native plugin | Android catalog marks it wrapper-internal |
| `bill` as a document type | Not in the iOS type list | Use `invoice` |
| Close-on-submit and submit-without-close both true | Two flags | Winner **Unconfirmed** |
| `backupDocsToiCloud` on Android | iOS key | Expected to be ignored. A warning is **Unconfirmed** |
| Contacts / calendar usage strings | Not in this README | Omit |

## Differences that change host code

1. Await `addListener` first, then `void` `setLensEventDelegate()` before `void` `veryfiInitLens`. Init does not assign the delegate.
2. Do not await native plugin methods and do not treat a settled promise as configure success. There is no completion bool and no configure-ready signal.
3. iOS retry rejects unless metadata and `imageSourceTag` are present. Android ignores them.
4. Android Full rejects `credit_card` and `code`. iOS Full contents are **Unconfirmed**.
5. Web builds call empty functions and never open a camera.

## Still open in Lens settings

Which dashboard keys merge when `ignoreRemoteSettings` is false; who should change `computeIsOn` / `gpuIsOn` / `boostModeIsOn`; whether driver-license and insurance backs require `packageMaxScans == 2` (any-document backs do).
