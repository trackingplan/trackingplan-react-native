#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to the package.json and gradle.properties files
const packageJsonPath = path.resolve(__dirname, '../package.json');
const gradlePropertiesPath = path.resolve(
  __dirname,
  '../android/gradle.properties'
);

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get versions from package.json
const androidSdkVersion = packageJson.trackingplan.androidVersion;
const androidPluginVersion = packageJson.trackingplan.androidPluginVersion;

// Read the current gradle.properties
let content = fs.readFileSync(gradlePropertiesPath, 'utf8');
let changed = false;

// Sync trackingplanSdkVersion (from androidVersion)
const sdkReplaced = content.replace(
  /trackingplanSdkVersion=.*/,
  `trackingplanSdkVersion=${androidSdkVersion}`
);
if (sdkReplaced !== content) {
  content = sdkReplaced;
  changed = true;
} else if (!content.includes('trackingplanSdkVersion=')) {
  content += `\ntrackingplanSdkVersion=${androidSdkVersion}\n`;
  changed = true;
}

// Sync trackingplanVersion (from androidPluginVersion — adapter)
const pluginReplaced = content.replace(
  /trackingplanVersion=.*/,
  `trackingplanVersion=${androidPluginVersion}`
);
if (pluginReplaced !== content) {
  content = pluginReplaced;
  changed = true;
} else if (!content.includes('trackingplanVersion=')) {
  content += `\ntrackingplanVersion=${androidPluginVersion}\n`;
  changed = true;
}

if (changed) {
  fs.writeFileSync(gradlePropertiesPath, content, 'utf8');
  console.log(
    `Updated gradle.properties: trackingplanSdkVersion=${androidSdkVersion}, trackingplanVersion=${androidPluginVersion}`
  );
}
