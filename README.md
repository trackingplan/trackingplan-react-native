# Trackingplan for React Native SDK

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Choose Your Project Type](#choose-your-project-type)
  - [Expo Projects](#expo-projects)
  - [React Native CLI Projects](#react-native-cli-projects)
- [Usage](#usage)
- [Need Help?](#need-help)
- [Learn More](#learn-more)
- [License](#license)

## Requirements

- react-native >=0.77
- Android: minSdkVersion >= 24
- Android: Gradle Plugin >= 8.0.2

## Installation

### Choose Your Project Type

Before proceeding, identify your project type:

- **Expo Projects**: Use Expo CLI, have an `app.json` or `app.config.js` file, and may use EAS Build
- **React Native CLI Projects**: Use React Native CLI, have separate `android/` and `ios/` directories

---

## Expo Projects

**Requirements for Expo:**

- Expo SDK 50+
- Custom development builds (Expo plugins require custom native code)
- ⚠️ **Note**: This will NOT work with Expo Go due to native dependencies

### Step 1: Install the Package

```sh
# Using npm
npm install --save @trackingplan/react-native

# Using yarn
yarn add @trackingplan/react-native
```

### Step 2: Configure the Expo Plugin

Add the plugin to your `app.config.js` or `app.json` with a different `tpId` for Android and iOS.

**app.config.js**

```javascript
export default {
  expo: {
    name: 'Your App',
    // ... other config
    plugins: [
      [
        '@trackingplan/react-native',
        {
          android: {
            tpId: 'YOUR_ANDROID_TP_ID', // Android-specific Trackingplan ID
          },
          ios: {
            tpId: 'YOUR_IOS_TP_ID', // iOS-specific Trackingplan ID
          },
          environment: 'PRODUCTION', // Optional: shared across both platforms
          debug: false, // Optional: shared across both platforms
          tags: { // Optional: custom tags for tracking (shared across both platforms)
            // For example
            site_locale: 'es-ES',
            country: 'ES'
            // ...
          },
        },
      ],
    ],
  },
};
```

**app.json**

```json
{
  "expo": {
    "name": "Your App",
    "plugins": [
      [
        "@trackingplan/react-native",
        {
          "android": {
            "tpId": "YOUR_ANDROID_TP_ID"
          },
          "ios": {
            "tpId": "YOUR_IOS_TP_ID"
          },
          "environment": "PRODUCTION",
          "debug": false,
          "tags": {
            "site_locale": "es-ES",
            "country": "ES"
          }
        }
      ]
    ]
  }
}
```

### Step 3: Rebuild Your Project

```sh
# For development builds
npx expo run:android
npx expo run:ios

# For EAS builds
eas build --platform android
eas build --platform ios
```

### ✅ Expo Setup Complete!

The Expo plugin automatically handles:

- Android Gradle dependencies and configuration
- iOS CocoaPods dependency
- Native initialization code with your Trackingplan ID
- Custom tags configuration (if provided)

**No additional configuration needed!**

---

## React Native CLI Projects

For React Native CLI projects, manual native configuration is required.

### Step 1: Install the Package

```sh
# Using npm
npm install --save @trackingplan/react-native

# Using yarn
yarn add @trackingplan/react-native
```

### Step 2: Android Configuration

1. **Update root build.gradle**

   Open `/android/build.gradle` and add the Trackingplan adapter:

   ```gradle
   buildscript {
       ext {
           // ... other ext properties
           trackingplanVersion = findProject(':trackingplan_react-native').ext.get('trackingplanVersion')
       }
       dependencies {
           // ... other dependencies
           classpath "com.trackingplan.client:adapter:$trackingplanVersion"
       }
   }
   ```

   > **Important:** Use the programmatic approach above to ensure version compatibility. Hardcoding a version string may cause compatibility issues.

2. **Apply the Gradle plugin**

   Modify `/android/app/build.gradle`:

   ```gradle
   // ... other plugins
   apply plugin: "com.trackingplan.client"
   ```

3. **Initialize in MainApplication**

   Open `/android/app/src/main/java/com/{projectName}/MainApplication.kt`:

   ```kotlin
   import com.trackingplan.client.sdk.Trackingplan // Add this import

   class MainApplication : Application(), ReactApplication {
       override fun onCreate() {
           super.onCreate()
           Trackingplan.init("YOUR_ANDROID_TP_ID").start(this) // Replace with your Android Trackingplan ID
           // ...other code
       }
   }
   ```

### Step 3: iOS Configuration

Open `/ios/{projectName}/AppDelegate.swift`:

```swift
import Trackingplan // Add this import

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        Trackingplan.initialize(tpId: "YOUR_IOS_TP_ID") // Replace with your iOS Trackingplan ID
        // ...other code
        return true
    }
}
```

### Step 4: Link and Rebuild

```sh
# For Android
npx react-native run-android

# For iOS
cd ios/
pod install --repo-update
cd ..
npx react-native run-ios
```

### ✅ React Native CLI Setup Complete!

## Usage

At this point, your app is ready to start monitoring traffic sent to your data destinations with Trackingplan.

### Updating Tags After Initialization

You can dynamically update tags after the SDK has been initialized using the `updateTags` method. This is particularly useful for updating tags that change during the app lifecycle, such as user locale preferences.

```typescript
import Trackingplan from '@trackingplan/react-native';

// Update tags when user changes language/locale
Trackingplan.updateTags({
  site_locale: 'es-ES',
  country: 'ES'
});
```

The `updateTags` method:
- Merges new tags with existing ones
- Overwrites values for existing keys
- Takes effect immediately for all subsequent tracked events
- Tags should be string key-value pairs only

## Need Help?

Questions? Problems? Need more info? We can help! Contact us [here](mailto:team@trackingplan.com).

## Learn More

Visit www.trackingplan.com

## License

Copyright © 2025 Trackingplan Inc. All Rights Reserved.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
