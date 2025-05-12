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

// Get the androidVersion from package.json
const androidVersion = packageJson.trackingplan.androidVersion;

// Read the current gradle.properties
const gradlePropertiesContent = fs.readFileSync(gradlePropertiesPath, 'utf8');

let versionChanged = false;

// Check if the trackingplanVersion property already exists
if (gradlePropertiesContent.includes('trackingplanVersion=')) {
  // Replace the existing version
  const updatedGradleProperties = gradlePropertiesContent.replace(
    /trackingplanVersion=.*/,
    `trackingplanVersion=${androidVersion}`
  );

  if (updatedGradleProperties !== gradlePropertiesContent) {
    fs.writeFileSync(gradlePropertiesPath, updatedGradleProperties, 'utf8');
    versionChanged = true;
  }
} else {
  // Add the version property
  const updatedGradleProperties = `${gradlePropertiesContent}\ntrackingplanVersion=${androidVersion}\n`;
  fs.writeFileSync(gradlePropertiesPath, updatedGradleProperties, 'utf8');
  versionChanged = true;
}

if (versionChanged) {
  console.log(
    `Updated trackingplanVersion to ${androidVersion} in gradle.properties`
  );
}
