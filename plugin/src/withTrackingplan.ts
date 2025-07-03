import { type ConfigPlugin, withPlugins } from '@expo/config-plugins';
import withTrackingplanAndroid from './withTrackingplanAndroid';
import withTrackingplanIOS from './withTrackingplanIOS';

export interface TrackingplanPluginOptions {
  tpId: string;
  environment?: string;
  debug?: boolean;
}

const withTrackingplan: ConfigPlugin<TrackingplanPluginOptions> = (
  config,
  options
) => {
  return withPlugins(config, [
    [withTrackingplanAndroid, options],
    [withTrackingplanIOS, options],
  ]);
};

export default withTrackingplan;
