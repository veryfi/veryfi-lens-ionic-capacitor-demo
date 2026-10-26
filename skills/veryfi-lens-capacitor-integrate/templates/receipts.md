# Receipts

Receipts, invoices, and other documents on the Full binary. Long receipts are [long-receipts.md](long-receipts.md). Install and listeners: [install.md](../install.md), [implementation.md](../implementation.md).

## Permissions

Camera usage string. Photo library usage because gallery is on. No photo-add key (backups off). No location key.

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
  documentTypes: ['receipt', 'invoice', 'other'],
  showDocumentTypes: true, // required so the user can switch
  defaultSelectedDocumentType: 'receipt',
  autoSubmitDocumentOnCapture: false,
  imagePreviewIsOn: true,
  galleryIsOn: true,
  browseIsOn: true,
  autoCaptureIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  autoRotateIsOn: true,
  autoSkewCorrectionIsOn: true,
  cleanBorderIsOn: true,
  stitchIsOn: true,
  multiplePagesCaptureIsOn: true,
  multipleDocumentsIsOn: true,
  returnStitchedPDF: true,
  packageMaxScans: 10,
  closeCameraOnSubmit: true,
};
```

Keep local files across callbacks with `autoDeleteLocalResourcesAfterProcessing: false`.

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

Success `status` `"done"` carries extraction `data` when the engine is `"api"`. Image paths arrive earlier on `veryfiLensUpdate` (`img_original_path`, `img_thumbnail_path`, and `img_stitched_pdf_path` when a PDF was produced). This plugin has no `getFileBase64`. The path string is still `data` while the file exists.

## Do not

Set `"mobile"` for these types. Do not treat `multiplePagesCaptureIsOn` and `multipleDocumentsIsOn` as one switch.
