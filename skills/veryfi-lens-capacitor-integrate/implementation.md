# Init, delegate, events, files, entry points

Import `VeryfiLensCapacitor` from `@veryfi/veryfi-lens-capacitor`. Methods are the ones in `src/definitions.ts`. Web implementations in `src/web.ts` are empty.

## Credentials

```typescript
const credentials = {
  url: 'https://api.veryfi.com/',
  clientId,
  userName: username,
  apiKey,
};
```

`userName` is the key both bridges read. iOS passes the object to `VeryfiLensCredentials(with:)`. Android reads `apiKey`, `clientId`, `url`, and `userName` with empty-string defaults. Store secrets outside git.

iOS `veryfiInitLens` rejects with `"Credentials and settings must be sent to initialize the Lens SDK"` when either object is missing. Android does not reject; missing objects become empty `JSObject`s and configure still runs.

Empty credentials on the native iOS SDK can later surface as `veryfiLensError` with `msg` `invalid_credentials`, but only if the delegate is set. Android has no `invalid_credentials` delegate error. This plugin's init methods do not return a success boolean.

## Order

Register Capacitor listeners first. `addListener` is Capacitor's listener mechanism and returns a handle; awaiting it does not call the Lens native methods. Then invoke the native methods without awaiting their promises. `setLensEventDelegate` must run before `veryfiInitLens`: init calls `configure` and does not assign the delegate, so a delegate set afterward misses anything configure emits. `showCamera` does not wait for configure.

```typescript
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';

await VeryfiLensCapacitor.addListener('veryfiLensClose', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensError', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data) => {});
void VeryfiLensCapacitor.setLensEventDelegate();
void VeryfiLensCapacitor.veryfiInitLens({ credentials, settings });
void VeryfiLensCapacitor.showCamera();
```

| Step | iOS | Android |
|------|-----|---------|
| `addListener` | Capacitor registration. Not a method in `VeryfiLensCapacitorPlugin.swift` | Capacitor registration. Not a `@PluginMethod` in the Java class |
| `setLensEventDelegate` | `VeryfiLens.shared().delegate = self`. No `call.resolve` | `VeryfiLens.setDelegate(...)` with the four JSON methods. No `call.resolve` |
| `veryfiInitLens` | `configure(with:settings:)` **with no completion**. Does not set the delegate. No `call.resolve`. Rejects only when `credentials` or `settings` is missing | `configure(application, credentials, settings)` **with no callback**. Does not set the delegate. No `call.resolve` or `call.reject` |
| `showCamera` | Main queue, `showCamera(in:)` on `UIApplication.getTopViewController()`. Returns without presenting if that is nil. No `call.resolve` | `VeryfiLens.showCamera()`. No `call.resolve` |

**No configure-ready signal.** Neither bridge forwards a configure completion. Calling `showCamera` immediately after `veryfiInitLens` does not prove the native SDK is ready. That ordering gap is in the pinned plugin. Do not invent a timeout, a resolved `{ ok: true }`, or a second status callback.

## Promises

`definitions.ts` types every method as `Promise<void>`. In the pinned native code, iOS and Android **never** call `call.resolve` on init, delegate, camera, retry, discard, share OCR, or analytics. Awaiting those promises is not a usable implementation: the success path does not settle.

iOS `call.reject` only when init is missing `credentials` or `settings`, when retry is missing `packageID` **or** `metadata` **or** `imageSourceTag`, or when discard is missing `packageID`. The retry/discard reject string says `"packageID must be sent to retry upload"` even when the missing field is metadata or the tag. Android does not reject those calls. Do not await in order to observe a reject. `void` starts the call and does not wait. A host that must log an iOS reject can attach `.catch` without `await`.

`addListener` is the exception. It is Capacitor's listener API, not one of those unresolved plugin methods.

## Events

Listener names: `veryfiLensClose`, `veryfiLensError`, `veryfiLensSuccess`, `veryfiLensUpdate`, `veryfiLensAnalytics`.

The bridge forwards the native dictionary. It does not add an `event` wrapper and it does not rename keys. The Capacitor README does not restate field names. The subset other Lens READMEs document, which this plugin can forward when the SDK sends them:

| Moment | Fields |
|--------|--------|
| Close | `session_scan_count`, `queue_count`, `framework-version`, `framework-build` |
| Update image | `msg` `img_thumbnail_path`, `img_original_path`, or `img_stitched_pdf_path`; `data` path; `package_id` |
| Update progress | `msg` `progress`; `data` percent; `status` `inprogress` |
| Update cleared | `msg` `clear_package`; `status` `removed` |
| Success | `msg` `results`; `data`; `package_id`; `status` `done` |
| Error | `status` `error` plus `error`, or `status` `exception` plus `exception`; `package_id` |

Extra native keys can appear. Do not invent keys beyond that subset. Package success uses `status` `"done"`. Barcode and OCR results may be the raw result JSON without that envelope.

Native failure status is not rewritten: iOS `"fail"`, Android `"failed"`.

There is no `onHelpButtonClicked` listener. iOS `VeryfiLensCapacitorPlugin` does not implement that delegate method. Android's delegate object does not include it. `showHelpButton: true` may show the native control. With `showDefaultScanningGuide: false` the SDK would call a host callback this plugin does not implement. Leave Help off, or set `showDefaultScanningGuide: true` for the built-in guide only.

## Analytics

```typescript
await VeryfiLensCapacitor.addListener('veryfiLensAnalytics', (data) => {});
void VeryfiLensCapacitor.observeAnalyticsEvents();
```

| | iOS | Android |
|--|-----|---------|
| Source | `NotificationCenter` name `VeryfiLensAnalyticsEvent` | Broadcast `com.veryfi.lens.VeryfiLensSecureAnalyticsEvent` |
| Body | Notification object when it is a dictionary | `{ event, params }` |

`observeAnalyticsEvents` is in `definitions.ts` and is omitted from the README docgen index. Call it once; both bridges replace a previous receiver.

## Files

There is no `getFileBase64`. Update payloads still carry path strings in `data` when the SDK sends `img_thumbnail_path`, `img_original_path`, or `img_stitched_pdf_path`. The host reads those paths with its own file API while they exist.

`autoDeleteLocalResourcesAfterProcessing` defaults true: Lens deletes that package's files after processing. Set it false when the host must read paths later or keep more than one package. The host then owns deletion.

`clearLensStorage()` is not bridged. Do not invent a cleanup method.

`msg` `clear_package` with `status` `removed` means those assets are gone.

## Entry points

The only presentation method is `showCamera`.

| Need | What exists |
|------|-------------|
| Lens camera | `showCamera()` |
| Gallery as its own screen | **Not exported.** `galleryIsOn: true` shows the gallery control inside the camera |
| Files as their own screen | **Not exported.** In-camera: `showBrowserButton`, or `moreMenuIsOn` with `browseIsOn`, or `galleryIsOn` with `galleryButtonWithFilesIsOn` |
| Close from JS | **Not exported.** The user closes the camera, or `closeCameraOnSubmit` ends it after submit |
| No UI, files the app already has | **Not exported** (`uploadImages`). Not Headless |

`browseIsOn` is not a global import gate. It only adds Browse under More > Import, and the base recipe hides More.

Do not call a second camera presentation on top of an open one. There is no second method to call.

## Retry, discard, OCR feedback

```typescript
void VeryfiLensCapacitor.retryPackage({
  packageID,
  metadata,
  imageSourceTag,
});
void VeryfiLensCapacitor.retryAllPackages();
void VeryfiLensCapacitor.discardPackage({ packageID });
void VeryfiLensCapacitor.discardAllPackages();
void VeryfiLensCapacitor.shareOCRFeedback();
```

Do not await these. iOS and Android never `call.resolve` them. iOS retry and discard can `call.reject` when required fields are missing; that rejection is not a configure result and is not a reason to await.

| | iOS | Android |
|--|-----|---------|
| Retry one | Rejects unless `packageID`, `metadata`, and `imageSourceTag` are all present. Then `utils.retryPackage` | `call.getString("packageID")` and `retryUpload`. Metadata and tag are ignored |
| Retry all | `utils.retryAllPackages()` | `retryAll()` |
| Discard | Rejects when `packageID` is missing. Then `utils.discardPackage` | `discardUpload(packageID)` with no reject when the id is null |
| Share OCR | `shareOCRFeedback()` | `shareOCRFeedback()` |

These methods are in `definitions.ts`. The README docgen index does not list them.

## Decoupled capture

`dataExtractionEngine: "none"` means Lens does not call Process a Document.

- Local package: `uploadWithoutProcessingIsOn: false` and `autoDeleteLocalResourcesAfterProcessing: false`. Success `data` can include `local_package_path`.
- Remote package: `uploadWithoutProcessingIsOn: true` with `"none"`. Success `data` keeps `bucket` and `package_path`.

## Info view

Do not set `showInfoButton` or `cameraInfoView`. They are native views (`VeryfiInfoView` on iOS, `Fragment` on Android). This plugin does not replace a bool with an empty view the way the React Native bridge does. iOS applies `showInfoButton` only when the value is already a `VeryfiInfoView`. A bool or string does not become a screen. Android `initWithJsonObject` behavior for a bool is **Unconfirmed**. Either way the host's UI is not embedded. There is no help-screen method to use instead.
