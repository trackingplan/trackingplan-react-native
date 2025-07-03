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

Add the plugin to your `app.config.js` or `app.json`. Replace `YOUR_TP_ID` with your actual Trackingplan ID (found in your Trackingplan dashboard).

**Option A: app.config.js**

```javascript
export default {
  expo: {
    name: 'Your App',
    // ... other config
    plugins: [
      [
        '@trackingplan/react-native',
        {
          tpId: 'YOUR_TP_ID', // Replace with your actual Trackingplan ID
        },
      ],
    ],
  },
};
```

**Option B: app.json**

```json
{
  "expo": {
    "name": "Your App",
    "plugins": [
      [
        "@trackingplan/react-native",
        {
          "tpId": "YOUR_TP_ID"
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
           Trackingplan.init("YOUR_TP_ID").start(this) // Add this line
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
        Trackingplan.initialize(tpId: "YOUR_TP_ID") // Add this line
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

## Need Help?

Questions? Problems? Need more info? We can help! Contact us [here](mailto:team@trackingplan.com).

## Learn More

Visit www.trackingplan.com

## License

Copyright © 2025 Trackingplan Inc. All Rights Reserved.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
