import { type ConfigPlugin, withAppDelegate } from '@expo/config-plugins';

import type { TrackingplanPluginOptions } from './withTrackingplan';

const withTrackingplanIOS: ConfigPlugin<TrackingplanPluginOptions> = (
  config,
  options
) => {
  const { tpId, environment, debug } = options;

  // Apply AppDelegate modifications
  if (tpId) {
    config = withAppDelegate(config, (config) => {
      const { contents } = config.modResults;
      let modifiedContents = contents;

      // Add import if not already present
      if (!modifiedContents.includes('import Trackingplan')) {
        // Look for any import statement to place our import after
        const importRegex = /import\s+\w+/;
        const importMatch = modifiedContents.match(importRegex);
        if (importMatch) {
          const insertIndex = importMatch.index! + importMatch[0].length;
          const importStatement = '\nimport Trackingplan\n';
          modifiedContents =
            modifiedContents.slice(0, insertIndex) +
            importStatement +
            modifiedContents.slice(insertIndex);
        }
      }

      // Add initialization if not already present
      if (!modifiedContents.includes('Trackingplan.initialize')) {
        // Look for the didFinishLaunchingWithOptions method
        const didFinishLaunchingRegex =
          /func\s+application\s*\([^)]*didFinishLaunchingWithOptions[^{]*\{\s*/;
        const launchingMatch = modifiedContents.match(didFinishLaunchingRegex);
        if (launchingMatch) {
          const insertIndex = launchingMatch.index! + launchingMatch[0].length;
          let initParams = `tpId: "${tpId}"`;
          if (environment) {
            initParams += `, environment: "${environment}"`;
          }
          if (debug) {
            initParams += `, debug: true`;
          }
          const initStatement = `\n    Trackingplan.initialize(${initParams})\n`;
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

export default withTrackingplanIOS;
