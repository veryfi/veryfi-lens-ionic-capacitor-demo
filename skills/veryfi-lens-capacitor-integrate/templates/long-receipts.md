# Long receipts

Vertical multi-frame stitch (`long_receipt`). It is not ordinary `stitchIsOn` on a receipt. Android Full allows `LONG_RECEIPT`. iOS presence inside the Full SPM package (`veryfi-lens-spm.git` from `3.0.16`) was not unpacked (**Unconfirmed**).

## Permissions

Camera. Photo library if `galleryIsOn` stays true.

## Settings

One type, so the picker stays off. Keep `stitchIsOn` true together with the document type.

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
  documentTypes: ['long_receipt'],
  showDocumentTypes: false,
  stitchIsOn: true,
  multiplePagesCaptureIsOn: true,
  returnStitchedPDF: true,
  autoCaptureIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  galleryIsOn: true,
};
```

`showGuideCounter` is how often the built-in long-receipt guide auto-shows. Zero disables that. `showHelpButton` plus `showDefaultScanningGuide` replays the built-in guide. This plugin does not emit a help click and cannot present a host screen from that button.

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

Watch `onVeryfiLensUpdate` for `img_stitched_pdf_path` when `returnStitchedPDF` is true.

## Do not

Replace this template with `documentTypes: ['receipt']` and `stitchIsOn` alone. Do not promise check TIFF or Remote Models here.
