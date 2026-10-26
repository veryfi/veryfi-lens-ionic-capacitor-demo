# Source record

Do not bump this pin from the skill.

| | |
|--|--|
| Plugin | Capacitor Veryfi Lens |
| Package | `@veryfi/veryfi-lens-capacitor` |
| Version | `2.0.61` (`veryfi-lens-capacitor/package.json`) |
| Path | `/Users/veryfij/plugins/veryfi-lens-capacitor-plugin` |
| Commit | `558244333860701fea3b933bc5cf9de2df8b3f50` |

## Files read

| Role | Path |
|------|------|
| Contract | `veryfi-lens-capacitor/src/definitions.ts` |
| Registration | `veryfi-lens-capacitor/src/index.ts` |
| Web | `veryfi-lens-capacitor/src/web.ts` |
| iOS bridge | `veryfi-lens-capacitor/ios/Sources/VeryfiVeryfiLensCapacitor/VeryfiLensCapacitorPlugin.swift` |
| iOS top VC | `veryfi-lens-capacitor/ios/Sources/VeryfiVeryfiLensCapacitor/UIApplication+GetTopVC.swift` |
| Android bridge | `veryfi-lens-capacitor/android/src/main/java/com/veryfi/capacitor/VeryfiLensCapacitorPlugin.java` |
| SPM | `veryfi-lens-capacitor/Package.swift` |
| Podspec | `veryfi-lens-capacitor/VeryfiVeryfiLensCapacitor.podspec` |
| Android Gradle | `veryfi-lens-capacitor/android/build.gradle` |
| README | `veryfi-lens-capacitor/README.md` |

`ios/Plugin/VeryfiLensCapacitorPlugin.swift` is another copy. `Package.swift` and the podspec compile `ios/Sources/VeryfiVeryfiLensCapacitor`. This skill follows that target.

## Versions inside the plugin

| Side | What the files say |
|------|--------------------|
| Android | `com.veryfi.lens:veryfi-lens-sdk:2.6.0.18`, `minSdkVersion` 23 |
| iOS | SPM `veryfi-lens-spm.git` from `3.0.16`, product `VeryfiLens`. Pod `VeryfiLens`. iOS 13 |

## Not verified by running

- That `npm install` against the private registry succeeds here
- Host code must not await init, delegate, camera, retry, discard, share, or analytics. Those methods never call `call.resolve`. Whether some Capacitor runtime would still settle them was not executed; the success path in this source does not
- Models embedded in the Full SPM binary
- Android `initWithJsonObject` for every recipe key
- The duplicate `ios/Plugin` sources method-by-method against `ios/Sources`
- `veryfiInitLens` on Android calling `initWithJsonObject` twice (once inside the catch path's try, then again unconditionally). Runtime if the second call throws is **Unconfirmed**
