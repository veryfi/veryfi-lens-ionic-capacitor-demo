# Full UI recipe

Use when the host captures receipts, invoices, other documents, and long receipts in one camera. This is a settings recipe on the Full binary the plugin already links. It is not a second package. Narrower products have their own templates.

Android Full allows these four types. iOS is the Full SPM package `veryfi-lens-spm.git` from `3.0.16`. Which extra models that package embeds was not unpacked (**Unconfirmed**). If long-receipt detection fails on iOS, ask support about models. Do not add another pod.

Client settings are a dictionary. Wire-up is [implementation.md](../implementation.md). Install is [install.md](../install.md).

## Permissions

`NSCameraUsageDescription`. Photo library usage because `galleryIsOn` is true. Do not add the photo-library **add** key: backups are off. Do not add location.

## Settings

Base hardening, then the Full recipe. `showDocumentTypes` stays true because more than one type is set.

```javascript
const settings = {
  ignoreRemoteSettings: true, // dashboard lens_settings must not overwrite this object
  backupDocsToGallery: false, // default true copies every scan into Photos
  backupDocsToiCloud: false,
  moreSettingsMenuIsOn: false,
  moreMenuIsOn: false, // Android would otherwise restore stored user overrides
  autoCaptureOtherIsOn: false, // default true auto-captures "other"
  showNoDocumentDetectedWarning: false,
  dictateIsOn: false, // obsolete
  locationServicesIsOn: false,
  glareDetectionIsOn: false, // Android default true
  enableScreenshots: true, // device UI capture; imports are allowSubmittingScreenshots

  dataExtractionEngine: 'api',
  documentTypes: ['receipt', 'invoice', 'other', 'long_receipt'],
  showDocumentTypes: true,
  defaultSelectedDocumentType: 'receipt',
  autoSubmitDocumentOnCapture: false,
  batchUploadOnCamera: false,
  imagePreviewIsOn: true,
  galleryIsOn: true, // in-camera control; no showGallery method
  browseIsOn: true, // hidden while moreMenuIsOn is false
  showBrowserButton: false,
  autoCaptureIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  autoRotateIsOn: true,
  autoSkewCorrectionIsOn: true,
  cleanBorderIsOn: true,
  dewarpingIsOn: false,
  stitchIsOn: true,
  stitchOtherIsOn: false,
  multipleDocumentsIsOn: true, // submit preview can split packages
  multiplePagesCaptureIsOn: true, // side-by-side crops stay separate
  singleScanPackages: false,
  returnStitchedPDF: true,
  packageMaxScans: 10,
  closeCameraOnSubmit: true,
  sameFileUploadPreventionPolicy: 'session',
  allowSubmittingScreenshots: true,
  webhookIsOn: false,
  autoDeleteAfterProcessing: false, // server delete, not local files
};
```

If the host reads image paths after the callback, also set `autoDeleteLocalResourcesAfterProcessing: false`. `clearLensStorage` is not bridged.

## Present

Await only `addListener` (Capacitor's listener registration). Do not await `setLensEventDelegate`, `veryfiInitLens`, or `showCamera`: those native methods never call `call.resolve`. This pinned plugin exposes no configure-ready signal. `showCamera` immediately after `veryfiInitLens` is a source gap — native configure has no completion, so bridge ordering and readiness are not observable ([implementation.md](../implementation.md)).

```javascript
await VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensError', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensClose', (data) => {});
void VeryfiLensCapacitor.setLensEventDelegate();
void VeryfiLensCapacitor.veryfiInitLens({ credentials, settings });
void VeryfiLensCapacitor.showCamera();
```

This plugin exports `showCamera` only. `galleryIsOn` is the in-camera gallery control. There is no `showGallery` or `showDocumentBrowser`.

## Do not

Add `credit_card` or `code` to this list on Android. Do not set `showInfoButton`, `dictateIsOn`, or `"custom"`. Paid field detection is not this binary.
