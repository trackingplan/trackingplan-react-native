import {
  type ConfigPlugin,
  withAppBuildGradle,
  withMainApplication,
  withProjectBuildGradle,
} from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

import type { TrackingplanPluginOptions } from './withTrackingplan';

// Helper function to get Android version from root package.json
function getTrackingplanAndroidVersion(): string | null {
  try {
    // Go up from plugin/build to root directory (since compiled code is in build/)
    const rootPackageJsonPath = path.join(
      __dirname,
      '..',
      '..',
      'package.json'
    );
    const packageJson = JSON.parse(
      fs.readFileSync(rootPackageJsonPath, 'utf8')
    );
    const version = packageJson.trackingplan?.androidVersion;
    if (!version) {
      console.warn(
        'Trackingplan: androidVersion not found in package.json trackingplan section'
      );
      return null;
    }
    return version;
  } catch (error) {
    console.warn(
      'Trackingplan: Could not read package.json for androidVersion:',
      error
    );
    return null;
  }
}

// Helper function to set classpath similar to GoogleServices
function setTrackingplanClassPath(buildGradle: string): string {
  if (buildGradle.includes('com.trackingplan.client:adapter')) {
    return buildGradle;
  }

  const androidVersion = getTrackingplanAndroidVersion();
  if (!androidVersion) {
    console.warn(
      'Trackingplan: Skipping Android build.gradle modifications due to missing version'
    );
    return buildGradle;
  }

  // Add classpath using string replacement like GoogleServices
  return buildGradle.replace(
    /dependencies\s*{/,
    `dependencies {
    classpath "com.trackingplan.client:adapter:${androidVersion}"`
  );
}

// Helper function to apply plugin and add dependency
function applyTrackingplanPlugin(appBuildGradle: string): string {
  const androidVersion = getTrackingplanAndroidVersion();
  if (!androidVersion) {
    console.warn(
      'Trackingplan: Skipping Android app build.gradle modifications due to missing version'
    );
    return appBuildGradle;
  }

  let modifiedGradle = appBuildGradle;

  // Apply plugin after android application plugin
  if (!modifiedGradle.includes('apply plugin: "com.trackingplan.client"')) {
    modifiedGradle = modifiedGradle.replace(
      /apply plugin: "com\.android\.application"/,
      `apply plugin: "com.android.application"
apply plugin: "com.trackingplan.client"`
    );
  }

  return modifiedGradle;
}

const withTrackingplanAndroid: ConfigPlugin<TrackingplanPluginOptions> = (
  config,
  options
) => {
  const { tpId, environment, debug } = options;

  // Apply project build.gradle modifications
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = setTrackingplanClassPath(
        config.modResults.contents
      );
    }
    return config;
  });

  // Apply app build.gradle modifications
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = applyTrackingplanPlugin(
        config.modResults.contents
      );
    }
    return config;
  });

  // Apply MainApplication modifications
  if (tpId) {
    config = withMainApplication(config, (config) => {
      const { language, contents } = config.modResults;
      const isKotlin = language === 'kt';

      let modifiedContents = contents;

      // Add import
      if (
        !modifiedContents.includes(
          'import com.trackingplan.client.sdk.Trackingplan'
        )
      ) {
        const packageRegex = /package .+;?\n/;
        const packageMatch = modifiedContents.match(packageRegex);
        if (packageMatch) {
          const insertIndex = packageMatch.index! + packageMatch[0].length;
          const importStatement =
            '\nimport com.trackingplan.client.sdk.Trackingplan\n';
          modifiedContents =
            modifiedContents.slice(0, insertIndex) +
            importStatement +
            modifiedContents.slice(insertIndex);
        }
      }

      // Add initialization
      if (!modifiedContents.includes('Trackingplan.init')) {
        const onCreateRegex = isKotlin
          ? /override fun onCreate\(\)\s*{\s*super\.onCreate\(\)/
          : /@Override\s+public void onCreate\(\)\s*{\s*super\.onCreate\(\)/;
        const onCreateMatch = modifiedContents.match(onCreateRegex);
        if (onCreateMatch) {
          const insertIndex = onCreateMatch.index! + onCreateMatch[0].length;
          let initChain = `Trackingplan.init("${tpId}")`;
          if (environment) {
            initChain += `\n            .environment("${environment}")`;
          }
          if (debug) {
            initChain += `\n            .enableDebug()`;
          }
          initChain += `\n            .start(this)${isKotlin ? '' : ';'}`;
          const initStatement = `\n    ${initChain}\n`;
          modifiedContents =
            modifiedContents.slice(0, insertIndex) +
            initStatement +
            modifiedContents.slice(insertIndex);
        }
      }

      config.modResults.contents = modifiedContents;
      return config;
    });
  }

  return config;
};

export default withTrackingplanAndroid;
