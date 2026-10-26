# Checks

Capture and cloud extract for `check` on the Full binary. Android Full allows `CHECK`. iOS model presence in `veryfi-lens-spm.git` from `3.0.16` is **Unconfirmed**.

Bank-check TIFF (`retrieveCheckTiffIsOn`) is a Remote Models feature. This plugin does not link that binary. Do not set the flag and do not promise a TIFF file.

## Permissions

Camera. Photo library because gallery and browse are on. Backups stay off, so no photo-add key.

## Settings

```javascript
const settings = {
  ignoreRemoteSettings: true,
  backupDocsToGallery: false,
  backupDocsToiCloud: false,
  moreSettingsMenuIsOn: false,
  moreMenuIsOn: false,
  autoCaptureOtherIsOn: false,
  showNoDocumentDetectedWarning: false,
  dictateIsOn: false,
  locationServicesIsOn: false,
  glareDetectionIsOn: false,
  enableScreenshots: true,

  dataExtractionEngine: 'api',
  documentTypes: ['check'],
  showDocumentTypes: false,
  stitchIsOn: false,
  autoCaptureIsOn: false,
  galleryIsOn: true,
  browseIsOn: true,
  checksBackIsOn: true,
  checksBackIsRequired: false, // true only when both sides are mandatory
  checkSequenceMode: true, // front-then-back UI
  forceLandscapeImage: true,
  autoSelectManualCropIsOn: true,
  autoRotateIsOn: true,
  autoSkewCorrectionIsOn: false,
  captureMarginRatio: 0.08,
  checksCropMargin: 2,
  checksMinAspectRatio: 1.9,
  checksMaxAspectRatio: 2.85,
  forceCropLayoutOnRetake: true,
  cropLayoutShowDelay: 15.0,
  cropLayoutAspectRatio: 2.18,
  cropLayoutCornerRadius: 5,
  cropLayoutOverlayAlpha: 0.3,
  validateCheckSize: true,
  validateCheckSides: true,
  validateCheckCorners: false, // algorithmic; enable only if the customer asked
  allowSubmitCheckSideNotDetected: true,
  allowSubmitCheckCornersNotDetected: true,
  allowSubmitUndetectedDocsIsOn: false,
  returnStitchedPDF: true,
};
```

`browseIsOn` does not show a row while `moreMenuIsOn` is false. This plugin has no `showDocumentBrowser`. Use `showBrowserButton: true` for a Files button inside the camera, or turn the More menu on with `browseIsOn`.

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

Extraction returns on `onVeryfiLensSuccess` with engine `"api"`. There is no check TIFF path to read.

## Do not

Set `stitchIsOn` true. Set `checksBackIsRequired` true unless both sides are mandatory. Set `validateCheckCorners` true unless the customer accepts an aggressive gate. Do not use `anyDocumentBackIsOn` for checks.
