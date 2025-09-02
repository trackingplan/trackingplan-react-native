import TrackingplanReactNativeModule from './NativeTrackingplanReactNative';

/**
 * Trackingplan SDK for React Native
 */
class Trackingplan {
  /**
   * Updates the tags in the current Trackingplan configuration.
   * This method can be called after the SDK has been initialized via the Expo plugin
   * or manual native configuration.
   *
   * @param tags - An object containing key-value pairs of tags to update
   * @example
   * // Update locale when user changes language
   * Trackingplan.updateTags({
   *   site_locale: 'es-ES',
   *   country: 'ES'
   * });
   */
  static updateTags(tags: Record<string, string>): void {
    if (!TrackingplanReactNativeModule) {
      console.warn(
        'Trackingplan: Native module not available. Make sure the SDK is properly installed and initialized.'
      );
      return;
    }

    if (!tags || typeof tags !== 'object') {
      console.warn(
        'Trackingplan: updateTags requires a valid object with string key-value pairs'
      );
      return;
    }

    TrackingplanReactNativeModule.updateTags(tags);
  }
}

export default Trackingplan;
