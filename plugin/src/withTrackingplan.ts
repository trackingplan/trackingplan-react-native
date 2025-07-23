import { type ConfigPlugin, withPlugins } from '@expo/config-plugins';
import withTrackingplanAndroid, {
  type TrackingplanAndroidPluginOptions,
} from './withTrackingplanAndroid';
import withTrackingplanIOS, {
  type TrackingplanIOSPluginOptions,
} from './withTrackingplanIOS';

// Common options shared between single and platform-specific configurations
interface TrackingplanCommonOptions {
  environment?: string;
  debug?: boolean;
  tags?: Record<string, string>;
}

// Option 1: Single tpId for both platforms
interface TrackingplanSingleIdOptions extends TrackingplanCommonOptions {
  tpId: string;
  android?: never;
  ios?: never;
}

// Option 2: Platform-specific configuration
interface TrackingplanPlatformIdOptions extends TrackingplanCommonOptions {
  tpId?: never;
  android: {
    tpId: string;
  };
  ios: {
    tpId: string;
  };
}

export type TrackingplanPluginOptions =
  | TrackingplanSingleIdOptions
  | TrackingplanPlatformIdOptions;

const withTrackingplan: ConfigPlugin<TrackingplanPluginOptions> = (
  config,
  options
) => {
  // Transform options for platform plugins
  const androidOptions: TrackingplanAndroidPluginOptions =
    'android' in options
      ? {
          tpId: options.android!.tpId,
          environment: options.environment,
          debug: options.debug,
          tags: options.tags,
        }
      : {
          tpId: options.tpId!,
          environment: options.environment,
          debug: options.debug,
          tags: options.tags,
        };

  const iosOptions: TrackingplanIOSPluginOptions =
    'ios' in options
      ? {
          tpId: options.ios!.tpId,
          environment: options.environment,
          debug: options.debug,
          tags: options.tags,
        }
      : {
          tpId: options.tpId!,
          environment: options.environment,
          debug: options.debug,
          tags: options.tags,
        };

  return withPlugins(config, [
    [withTrackingplanAndroid, androidOptions],
    [withTrackingplanIOS, iosOptions],
  ]);
};

export default withTrackingplan;
