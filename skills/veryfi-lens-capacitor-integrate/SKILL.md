---
name: veryfi-lens-capacitor-integrate
description: >-
  Integrates Veryfi Lens into Capacitor with @veryfi/veryfi-lens-capacitor
  2.0.61: npm name, veryfiInitLens, setLensEventDelegate, listener names, the no-op
  web implementation, iOS and Android promise and retry differences, and
  Full-SDK recipes for receipts, long receipts, checks, credit cards,
  business cards, barcodes, OCR strips/caps, W-2, and W-9, plus Any-Documents
  support escalation. Use when adding Veryfi Lens to Capacitor or Ionic, or
  when a plugin method, setting, or event is in question.
---

# Veryfi Lens Capacitor

Walk a Capacitor host from install to a working first scan. Prefer the fewest settings. Do not invent methods, event names, or settings keys.

Facts were read from `@veryfi/veryfi-lens-capacitor` `2.0.61` at commit `558244333860701fea3b933bc5cf9de2df8b3f50`. The public contract is `src/definitions.ts`, registered in `src/index.ts` as `VeryfiLensCapacitor`. The README's docgen index omits methods that `definitions.ts` declares. Follow `definitions.ts`. If a fact is not in that plugin or in the Lens settings semantics recorded here, mark it **Unconfirmed** and leave it out of host code. Record: [sources.md](sources.md).

**Settings are a JSON object** of Lens keys. Do not construct `VeryfiLens*Settings` subclasses.

The plugin links the **Full** UI SDK. iOS SPM is `https://repo.veryfi.com/shared/lens/veryfi-lens-spm.git` from `3.0.16` (product `VeryfiLens`). The pod dependency name is `VeryfiLens`. Android is `com.veryfi.lens:veryfi-lens-sdk:2.6.0.18`. Product choice is a settings recipe on that binary, not a second npm package.

`src/web.ts` implements every method as an empty async function. Lens does not run in a browser.

## Pick a workflow

- **Quick** — the host already named the document. Ask nothing else. Apply base hardening plus one template, then state the assumptions.
- **Guided** — anything important is missing. Ask only the missing questions below, in one message, then continue.

### Quick

```
Lens Capacitor quick:
- [ ] Map request → one template
- [ ] Install @veryfi/veryfi-lens-capacitor and npx cap sync (install.md)
- [ ] addListener first, then void setLensEventDelegate, void veryfiInitLens, void showCamera
- [ ] Base hardening + one recipe
- [ ] showCamera only (no gallery or files method)
- [ ] Handle close / update / success / error
- [ ] Run conflicts.md
- [ ] Do not await native plugin methods; there is no configure-ready signal
```

Assumptions when the host did not say: Full UI binary the plugin already links, camera, `documentTypes` `receipt`, engine `"api"`, review then submit, in-camera gallery on, backups off, More menu off, dictate off. Not a web build.

### Guided

Ask only what is unknown:

1. **Documents** — receipt, invoice, other, long receipt, check, credit card, business card, barcode, OCR strip, OCR cap, W-2, W-9, or another document (Any-Documents).
2. **Extract** — Veryfi Cloud (`"api"`), on-device (`"mobile"`, only `credit_card`, `code`, `barcode`), or the customer runs Process a Document later (`"none"`).
3. **UX** — review then submit, auto-submit, or batch until max.
4. **Files after capture** — keep local paths, or let Lens delete them. Gallery and Files are in-camera settings only.

## Templates

| Product | Template |
|---------|----------|
| Full / several receipt-like types | [templates/full.md](templates/full.md) |
| Receipts | [templates/receipts.md](templates/receipts.md) |
| Long receipts | [templates/long-receipts.md](templates/long-receipts.md) |
| Checks | [templates/checks.md](templates/checks.md) |
| Credit cards | [templates/credit-cards.md](templates/credit-cards.md) |
| Business cards | [templates/business-cards.md](templates/business-cards.md) |
| Barcodes | [templates/barcodes.md](templates/barcodes.md) |
| OCR code strips | [templates/ocr-code-strips.md](templates/ocr-code-strips.md) |
| OCR bottle caps | [templates/ocr-code-caps.md](templates/ocr-code-caps.md) |
| W-2 | [templates/w2.md](templates/w2.md) |
| W-9 | [templates/w9.md](templates/w9.md) |
| Any-Documents | [templates/any-documents.md](templates/any-documents.md) |

Open one template. Shared references, one level deep:

- [install.md](install.md)
- [implementation.md](implementation.md) — init, delegate, events, promises, files, iOS vs Android
- [recipes.md](recipes.md)
- [settings-groups.md](settings-groups.md)
- [settings-catalog.md](settings-catalog.md)
- [conflicts.md](conflicts.md)
- [clarifications.md](clarifications.md)
- [troubleshooting.md](troubleshooting.md)
- [suggestions.md](suggestions.md)
- [checklist.md](checklist.md)
- [parity.md](parity.md)
- [sources.md](sources.md)

## Product limits

Headless Receipts and Headless Credit Cards are **unsupported**. This plugin does not export `process` or `headlessUpload`. Do not imitate them with `showCamera`.

`uploadImages` is not exported. It is a port candidate, not Headless. See [parity.md](parity.md).

Lite / App Clip is **unsupported**.

Remote Models is not the current SPM pin or Android coordinate. Per-plugin Remote Models variants are **planned**. Do not set `retrieveCheckTiffIsOn` and promise a TIFF download.

Any-Documents is an open solution, not a KYC-only or medical-only product. Nutrition facts, US passport, driver license, and prescription labels are shortcut flavors. Do not invent a template name. Contact support. See [templates/any-documents.md](templates/any-documents.md).

Credit card extraction is local only. Card data is never sent to the backend. Android Full does **not** allow `CREDIT_CARD` or `CODE`. Those recipes can fail to open the camera on Android. iOS model contents of the Full SPM package were not unpacked (**Unconfirmed**).

Local fraud detection and local field detection are paid and backend-gated. A settings key does not unlock either. This plugin does not link a Field Detection or Remote Models binary.

When size matters, Remote Models is the native flavor that downloads heavy resources after install. This plugin does not expose it yet. Compare the final release app with the Lens dependency and without it. Do not quote the XCFramework or AAR size. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).

## Wire-up

`addListener` is Capacitor's listener registration. Await those. The native plugin methods never call `call.resolve`, so awaiting them hangs on the success path. Do not await them.

`setLensEventDelegate` is what assigns the Lens delegate. `veryfiInitLens` calls `configure` and does not. Register listeners, set the delegate, then init, then present. This pinned plugin exposes no configure-ready signal. `showCamera` immediately after `veryfiInitLens` is a source gap: native configure has no completion, so bridge ordering and readiness are not observable.

```typescript
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';

await VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensError', (data) => {});
await VeryfiLensCapacitor.addListener('veryfiLensClose', (data) => {});
void VeryfiLensCapacitor.setLensEventDelegate();
void VeryfiLensCapacitor.veryfiInitLens({ credentials, settings });
void VeryfiLensCapacitor.showCamera();
```

iOS `call.reject` only for missing init objects or missing retry/discard fields. Android does not reject those calls. Neither side calls `call.resolve`. Do not add a fictional status return or a delay that pretends configure finished. Exact behavior: [implementation.md](implementation.md).

## Do not

- Edit the plugin or either native SDK from this skill
- `npm install veryfi-lens-capacitor` (that is not `package.json` `name`)
- Trust the README docgen index over `definitions.ts`
- Expect Lens on web (`src/web.ts` is a no-op)
- Await `veryfiInitLens`, `setLensEventDelegate`, `showCamera`, retry, discard, `shareOCRFeedback`, or `observeAnalyticsEvents`
- Skip `setLensEventDelegate`, or call it after `veryfiInitLens`
- Set `dataExtractionEngine` to `"custom"`
- Set `"mobile"` except for `credit_card`, `code`, or `barcode`
- Send credit card data to the backend
- Set `showInfoButton` to embed host UI. JSON cannot construct a `VeryfiInfoView`
- Promise a help callback. This plugin does not implement `onHelpButtonClicked`
- Promise `showGallery`, `showDocumentBrowser`, `closeCamera`, or `getFileBase64`
- Promise Lite, Headless, or current Remote Models
- Present an unverified Any-Documents template as included
- Quote an XCFramework or AAR size as the installed app-size increase
- Leave `dictateIsOn` true, backups on, or `ignoreRemoteSettings` false unless the host wants those behaviors
- Leave `moreMenuIsOn` true unless end users should override capture behavior
- Pass retry metadata and expect Android to use it
- Invent `uploadImages`, `headlessUpload`, or `clearLensStorage`

## Output

When generating host code, produce:

1. The `@veryfi/veryfi-lens-capacitor` install and `npx cap sync`
2. The four `addListener` registrations, then `void` `setLensEventDelegate`, `veryfiInitLens`, and one `showCamera`
3. The warning that this plugin has no configure-ready signal
4. The recipe object with a one-line comment per non-obvious flag
5. The Android Full limit for credit cards and codes, and any Unconfirmed item the host relies on
