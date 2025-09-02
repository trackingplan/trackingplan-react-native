import { type ConfigPlugin, withAppDelegate } from '@expo/config-plugins';

export interface TrackingplanIOSPluginOptions {
  tpId: string;
  environment?: string;
  debug?: boolean;
  tags?: Record<string, string>;
}

const withTrackingplanIOS: ConfigPlugin<TrackingplanIOSPluginOptions> = (
  config,
  options
) => {
  const { tpId, environment, debug, tags } = options;

  // Apply AppDelegate modifications
  if (tpId) {
    config = withAppDelegate(config, (cfg) => {
      const { contents } = cfg.modResults;
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
          if (tags && Object.keys(tags).length > 0) {
            const tagsEntries = Object.entries(tags)
              .map(([key, value]) => `"${key}": "${value}"`)
              .join(', ');
            initParams += `, tags: [${tagsEntries}]`;
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

      cfg.modResults.contents = modifiedContents;
      return cfg;
    });
  }

  return config;
};

export default withTrackingplanIOS;
