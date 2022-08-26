![Veryfi Logo](https://cdn.veryfi.com/logos/veryfi-logo-wide-github.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
# Veryfi Lens
Veryfi Lens is code (a framework) with UI for your mobile app to give it document capture superpowers in minutes.

Let Veryfi handle the complexities of frame processing, asset preprocessing, edge routing, and machine vision challenges in document capture. We have been at this for a long time and understand the intricate nature of mobile capture. That’s why we built Lens. Veryfi Lens is built by developers for developers; making the whole process of integrating Lens into your app fast and easy with as few lines as possible.

Veryfi Lens is a Framework: a self-contained, reusable chunks of code and resources you can import into you app.

Lens is built in native code and optimized for fast performance, clean user experience and low memory usage.

You can read further about Lens in Veryfi's dedicated page: https://www.veryfi.com/lens/

## Table of content
1. [Configuration](#configuration)
2. [iOS Localization](#localization)
3. [Other platforms](#other_platforms)
4. [Get in contact with our team](#contact)

### Configuration <a name="configuration"></a>
- Clone this repository
- Go to Lens: Maven (Android) section and generate your access credentials [here](https://hub.veryfi.com/api/settings/keys/#package-managers-container).
- Add your Maven credentials to your system environment. Replace [USERNAME] and [PASSWORD] with the credentials that were set up in the previous step.
```
export MAVEN_VERYFI_USERNAME=[USERNAME]
export MAVEN_VERYFI_PASSWORD=[PASSWORD]
```

- Clone this repository
- Go to Lens: Capacitor (iOS + Android) section and generate your access credentials [here](https://hub.veryfi.com/api/settings/keys/#package-managers-container).
- Run `npm config set @veryfi:registry https://nexus.veryfi.com/repository/npm/`
- Run `npm config set _auth $(echo -n '[USERNAME]:[PASSWORD]' | openssl base64 -A) --registry=https://nexus.veryfi.com/repository/npm`
- Run `npm i @veryfi/veryfi-lens-capacitor`
- Replace [USERNAME] and [PASSWORD] with the credentials that were set up in the previous step.


- Replace credentials in `home.page.ts` with yours
```
 const veryfiLensCredentials = {
      url: 'XXX', // replace XXX with your assigned Client Id
      clientId: 'XXX', // replace XXX with your assigned Username
      userName: 'XXX', // replace XXX with your assigned API Key
      apiKey: 'XXX' // replace XXX with your assigned Endpoint URL
    };
```
- iOS: Run `pod repo update` and `pod install` on the iOS folder.

NOTE: You need valid credentials to pull the Lens SDK from Veryfi's private repository. You can manage your credentials [here](https://hub.veryfi.com/api/settings/keys/#package-managers-container).
You can store your credentials with the `git credential` tool, so you don’t need to log in each time you install or update Lens. Here's one example of using this tool (replace `USERNAME` and `PASSWORD` with your credentials):
```
git credential approve <<EOF
protocol=https
host=repo.veryfi.com
path=shared/lens/veryfi-lens-podspec.git
username=USERNAME
password=PASSWORD

EOF
```

- Android: Add your [credentials](https://hub.veryfi.com/api/settings/keys/) as environment variables (Replace XXXX with your credentials):
```
export MAVEN_VERYFI_USERNAME=XXXX
export MAVEN_VERYFI_PASSWORD=XXXX
```
- Run `npm run build` from the root folder of the project to build the project.
- Run `npx cap sync` from the root folder of the project to sync the native app with the project files.

- Running the app: Run this command and replace `[PLATFORM]` with your desired platform (eg: ios, android):
```ionic capacitor run [PLATFORM]```

NOTE: If you have issues running the project from the terminal, use Android Studio or XCode to run the project in each platform.

### Other platforms <a name="other_platforms"></a>
We also support the following wrappers for native and hybrid frameworks:
- [Cordova](https://hub.veryfi.com/lens/docs/cordova/)
- [React Native](https://hub.veryfi.com/lens/docs/react-native/)
- [Flutter](https://hub.veryfi.com/lens/docs/flutter/)
- [Xamarin](https://hub.veryfi.com/lens/docs/xamarin/)
- [iOS](https://hub.veryfi.com/lens/docs/ios/)
- [Android](https://hub.veryfi.com/lens/docs/android/)

If you don't have access to our Hub, please contact our sales team, you can find the contact bellow.

### Get in contact with our sales team <a name="contact"></a>
Contact sales@veryfi.com to learn more about Veryfi's awesome products.
