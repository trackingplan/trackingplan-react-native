# Trackingplan for React Native SDK

## Table of Contents

- [Requirements](#requirements)
- [Installation](#Installation)
  - [Android](#android)
  - [iOS](#ios)
- [Autolinking & Rebuilding](#autolinking--rebuilding)
- [Usage](#usage)
- [Need Help?](#need-help)
- [Learn More](#learn-more)
- [License](#license)

## Requirements

- react-native >=0.77
- Android: minSdkVersion >= 24

## Installation

Install the Trackingplan for React Native SDK with NPM or Yarn:

```sh
# Using npm
npm install --save @trackingplan/react-native

# Using yarn
yarn add @trackingplan/react-native
```

Follow the instructions in the next sections to configure Trackingplan in Android and iOS.

### Android

1. Open your `/android/build.gradle` to include the Trackingplan adapter.

Add the adapter dependency:

```gradle
// Add this to your project's root build.gradle
buildscript {
    ext {
        // ... other ext properties
        trackingplanVersion = findProject(':trackingplan-react-native').ext.get('trackingplanVersion')
    }
    dependencies {
        // ... other dependencies
        classpath "com.trackingplan.client:adapter:$trackingplanVersion"
    }
}
```

> **Important:** The above approach is recommended to add the Trackingplan adapter. If you choose to hardcode a version string instead of using the programmatic approach, you MUST ensure that it exactly matches the version used by trackingplan-react-native, otherwise your app may experience compatibility issues.

2. Modify your `/android/app/build.gradle` to apply the Trackingplan Gradle plugin.

```gradle
// ... other plugins
apply plugin: "com.trackingplan.client"
```

3. Open your `/android/app/src/main/java/com/{projectName}/MainApplication.kt` and add the following:

At the top of the file, import the Trackingplan SDK:

```kotlin
import com.trackingplan.client.sdk.Trackingplan;
```

Within your existing `onCreate` method, add the following right after `super.onCreate()`:

```kotlin
override fun onCreate() {
  super.onCreate()
  Trackingplan.init("YOUR_TP_ID").start(this)
  // ...other code
}
```

### iOS

Open your `/ios/{projectName}/AppDelegate.swift` file and add the following:

At the top of the file, import the Trackingplan SDK:

```swift
import Trackingplan
```

Within your existing `application` method, add the following to the top of the method:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    Trackingplan.initialize(tpId: "YOUR_TP_ID")
    // ...other code
}
```

## Autolinking & Rebuilding

Once the above steps have been completed, the Trackingplan for React Native SDK must be linked to your project and your application needs to be rebuilt.

To automatically link the package, rebuild your project:

```console
# Android apps
npx react-native run-android

# iOS apps
cd ios/
pod install --repo-update
cd ..
npx react-native run-ios
```

## Usage

At this point, your app is ready to start monitoring traffic sent to your data destinations with Trackingplan.

## Need Help?

Questions? Problems? Need more info? We can help! Contact us [here](mailto:team@trackingplan.com).

## Learn More

Visit www.trackingplan.com

## License

Copyright © 2025 Trackingplan Inc. All Rights Reserved.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
