# Checklist

```
Capacitor Lens:
- [ ] Path: quick or guided
- [ ] Package @veryfi/veryfi-lens-capacitor, syntax from 2.0.61
- [ ] npx cap sync
- [ ] Not a web build (src/web.ts is a no-op)
- [ ] NSCameraUsageDescription added
- [ ] Photo and location keys only if that feature is on
- [ ] Maven credentials not committed
- [ ] addListener first, then void setLensEventDelegate, void veryfiInitLens, void showCamera
- [ ] Credentials use userName
- [ ] Base hardening from recipes.md
- [ ] One template only
- [ ] dataExtractionEngine is api, mobile, or none
- [ ] mobile only for credit_card, code, or barcode
- [ ] Credit card stays on device
- [ ] Android Full warning if the type is credit_card or code
- [ ] showCamera only
- [ ] showInfoButton omitted
- [ ] No getFileBase64, showGallery, or uploadImages
- [ ] dictateIsOn false, backups false, moreMenuIsOn false, ignoreRemoteSettings true
- [ ] Native methods not awaited; no configure-ready signal stated
- [ ] autoDeleteLocalResourcesAfterProcessing false if files are read later
- [ ] clearLensStorage not called
- [ ] retry metadata described as iOS-only
- [ ] No Headless, Lite, or Remote Models package
- [ ] Any-Documents template not invented
- [ ] conflicts.md reviewed
- [ ] Unconfirmed items named in the handoff
```

## Handoff card

```
Capacitor route:
- Path:
- Product: UI SDK Full (veryfi-lens-spm.git from 3.0.16 / veryfi-lens-sdk 2.6.0.18)
- Presentation: showCamera
- Documents:
- Recipe:
- Assumptions:
- Not bridged:
- Android limit:
- Promise caveat: no configure-ready signal; native calls are `void`, not `await`
- Unconfirmed:
```
