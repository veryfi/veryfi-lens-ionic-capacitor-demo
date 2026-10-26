# Install

Package `@veryfi/veryfi-lens-capacitor` version `2.0.61`. Plugin registration name `VeryfiLensCapacitor` (`src/index.ts`).

## Add the package

`package.json` `name` is `@veryfi/veryfi-lens-capacitor`. The README says:

```sh
npm install veryfi-lens-capacitor
npx cap sync
```

That unscoped name does not match `package.json`. Install the scoped name, then sync:

```sh
npm install @veryfi/veryfi-lens-capacitor
npx cap sync
```

The package is also published to `https://nexus.veryfi.com/repository/npm/` (`publishConfig`). Private registry auth is the host's concern. This skill does not store tokens.

Capacitor dependencies in this commit are `@capacitor/core`, `@capacitor/ios`, and `@capacitor/android` `^6.1.2`. SPM also depends on `capacitor-swift-pm` from `6.1.2`.

## iOS

`Package.swift` (swift-tools-version 5.9):

| | |
|--|--|
| Platform | iOS 13 |
| Lens | `https://repo.veryfi.com/shared/lens/veryfi-lens-spm.git` from `3.0.16` |
| Product | `VeryfiLens` |

`VeryfiVeryfiLensCapacitor.podspec` depends on `Capacitor`, `AWSS3`, and `VeryfiLens`, deployment target 13.0. `VeryfiLens` is the Full UI pod. Do not add a Receipts, Checks, Credit Cards, OCR, Lite, Headless, or Remote Models pod.

The SPM target path is `ios/Sources/VeryfiVeryfiLensCapacitor`. That is the bridge this skill describes. A second copy under `ios/Plugin/` is not the `Package.swift` target.

### Info.plist

The Capacitor README does not list usage strings. Add what the recipe uses:

| Key | When |
|-----|------|
| `NSCameraUsageDescription` | `showCamera` |
| `NSPhotoLibraryUsageDescription` | `galleryIsOn` or in-camera browse that reads photos |
| `NSPhotoLibraryAddUsageDescription` | only if `backupDocsToGallery` is true. Base recipe sets it false |
| `NSLocationWhenInUseUsageDescription` | only if `locationServicesIsOn` is true. Base recipe sets it false |

Do not add speech, contacts, or calendar usage strings for the base recipe. Dictate stays off. Contacts and calendar keys in older Lens READMEs are **Unconfirmed** / likely stale.

## Android

`android/build.gradle` sets `minSdkVersion` 23 (the `defaultConfig` block sets it twice; the later assignment is also 23). `compileSdkVersion` / `targetSdkVersion` fall back to 35.

```
implementation "com.veryfi.lens:veryfi-lens-sdk:2.6.0.18"
```

Maven: `https://nexus.veryfi.com/repository/maven-releases/` with `MAVEN_VERYFI_USERNAME` and `MAVEN_VERYFI_PASSWORD`. Do not commit those secrets.

That coordinate is the Full UI artifact. Do not add a flavor artifact, Lite, Headless, or `veryfi-lens-remote-models-sdk` beside it.

Android Full allows receipt, long receipt, other, any document, check, business card, invoice, W-2, W-9, and barcode. It does **not** allow `CREDIT_CARD` or `CODE`. The camera does not open for those types. See [templates/credit-cards.md](templates/credit-cards.md).

## Web

`src/web.ts` is selected by `registerPlugin` for the web platform. Every method returns an empty resolved promise and does nothing. Do not demo Lens in a browser. `npx cap sync` is for the native projects.

## Size

Remote Models is the native flavor that keeps the binary smaller and downloads heavy models after install. This plugin does not ship it. Variants are planned.

Measure the final iOS and Android release apps with this plugin and without it. The SPM checkout's XCFramework and the Maven AAR are fat artifacts. Neither file size is the install delta. [SDK binary sizes](https://docs.veryfi.com/lens/mobile/settings/sdk_binary_sizes/).
