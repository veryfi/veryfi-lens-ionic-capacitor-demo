# Barcodes

On-device barcode capture. `"mobile"` and `documentTypes: ['barcode']`. Android Full allows `BARCODE`. iOS model presence in `veryfi-lens-spm.git` from `3.0.16` is **Unconfirmed**.

## Permissions

Camera. Gallery is off.

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

  dataExtractionEngine: 'mobile',
  documentTypes: ['barcode'],
  showDocumentTypes: false,
  autoCaptureIsOn: true,
  galleryIsOn: false,
  stitchIsOn: false,
  autoLightDetectionIsOn: false,
  continuousAutoFocus: true, // close-up focus; Android acceptance Unconfirmed
  dewarpingIsOn: true,
  cleanBorderIsOn: true,
  autoRotateIsOn: true,
};
```

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

Barcode success JSON may be the result object itself, without `status` `"done"`. Read the payload you receive. Do not drop it for lacking the package envelope.

`continuousAutoFocus` is not in the plugin README. If Android ignores it, capture still runs; say the focus flag is **Unconfirmed** on Android.

## Do not

Use `"api"` when the host wants the on-device barcode result from Lens. This is not OCR `code` (strips and caps). Do not set `ocrType` here.
