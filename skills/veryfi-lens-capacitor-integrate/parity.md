# API parity and port candidates

"Bridged" means the method is on `src/definitions.ts` and the native plugin implements it. A missing wrapper is a plugin gap. Do not invent a TypeScript call. A **port** adds the argument on this plugin and calls the native SDK method that already exists. This skill does not make that change.

Headless products are a different binary, not a small port.

Host calls use `void` for every row except listeners. `addListener` is Capacitor's registration and may be awaited. Init, delegate, camera, retry, discard, share, and `observeAnalyticsEvents` never `call.resolve`. Do not await them. There is no configure-ready signal.

## Bridged

| Call | TypeScript | iOS | Android |
|------|------------|-----|---------|
| Init | `veryfiInitLens({ credentials, settings })` | `configure` with no completion. Rejects if either object is missing | `configure` with no callback. Empty defaults, no reject |
| Delegate | `setLensEventDelegate()` | Assigns `VeryfiLens.shared().delegate` | `setDelegate` with four methods |
| Camera | `showCamera()` | Top view controller, or no-op if none | `showCamera()` |
| Retry one | `retryPackage({ packageID, metadata, imageSourceTag })` | All three required | `packageID` only |
| Retry all | `retryAllPackages()` | utils | `retryAll()` |
| Discard one / all | `discardPackage({ packageID })`, `discardAllPackages()` | utils; discard one rejects without `packageID` | `discardUpload` / `discardAll`; no reject |
| Share OCR | `shareOCRFeedback()` | yes | yes |
| Analytics | `observeAnalyticsEvents()` + `veryfiLensAnalytics` | `VeryfiLensAnalyticsEvent` | secure analytics broadcast |
| Listeners | `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate` | `notifyListeners` | `notifyListeners` |

## Not bridged (port candidates)

| Native API | Status |
|------------|--------|
| `showGallery` | Not in `definitions.ts`. In-camera gallery is `galleryIsOn` |
| `showDocumentBrowser` | Not exported. In-camera Files flags only |
| `closeCamera` | Not exported |
| `getFileBase64` | Not exported. Paths still arrive in update `data` |
| `uploadImages` | Not exported. UI SDK no-camera upload. Not Headless. Android's `isSameTransaction` has no iOS twin |
| iOS `headlessUpload` | Not exported. Not a Headless product |
| Headless `process` | **Unsupported.** Plugin does not link `VeryfiLensHeadless` |
| Lite / App Clip | **Unsupported** |
| Remote Models package | **Planned.** Not the current SPM or Gradle coordinate |
| `utils.clearLensStorage` | Not exported. Host deletes paths it kept |
| `onHelpButtonClicked` / host help screen | Not implemented. React Native has this; Capacitor does not |
| `VeryfiInfoView` / info `Fragment` | Hard to bridge. JSON cannot carry the view. See below |
| `lensVC`, `showCrop`, SwiftUI helpers | Not exported |
| `removeDelegate()` | Not exported |

## Hard to bridge: info views

`showInfoButton` and `cameraInfoView` are view objects. This plugin passes the settings map through `VeryfiLensSettings(with:)` / `initWithJsonObject`. It does not substitute an empty view when the value is a boolean.

iOS keeps `showInfoButton` only when the value is already a `VeryfiInfoView`. A JSON bool or string does not become a screen. `cameraInfoView` and `utils.updateCameraInfoView` are not bridged.

On iOS, Help and `showInfoButton` share one camera control and Help wins. This plugin cannot present host UI from Help. Prefer the built-in guide (`showHelpButton` and `showDefaultScanningGuide`) or no help button. Do not set `showInfoButton`.

## Android Full document types

`veryfi-lens-sdk` `2.6.0.18` is Full. It allows receipt, long receipt, invoice, other, check, business card, barcode, W-2, W-9, and `ANY_DOCUMENT`. It does not allow `CREDIT_CARD` or `CODE`. A JavaScript-only port will not fix that. A future plugin would link the Credit Cards or OCR artifact. Do not add those Gradle lines in the host.

iOS Full SPM contents were not unpacked. **Unconfirmed** for credit card, code, check, W-2, and W-9 models.

## Do not generate

- `VeryfiLensCapacitor.showGallery`
- `VeryfiLensCapacitor.showDocumentBrowser`
- `VeryfiLensCapacitor.closeCamera`
- `VeryfiLensCapacitor.getFileBase64`
- `VeryfiLensCapacitor.uploadImages`
- `VeryfiLensCapacitor.showHelpScreen`
- A second Lens package for a flavor, Lite, Headless, or Remote Models
