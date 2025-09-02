// Mock the native module
jest.mock('../NativeTrackingplanReactNative', () => ({
  updateTags: jest.fn(),
}));

import Trackingplan from '../index';
import TrackingplanModule from '../NativeTrackingplanReactNative';

describe('Trackingplan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('updateTags', () => {
    it('should call native updateTags method with valid tags', () => {
      const tags = { site_locale: 'es-ES', country: 'ES' };

      Trackingplan.updateTags(tags);

      expect(TrackingplanModule.updateTags).toHaveBeenCalledWith(tags);
    });

    it('should warn when tags parameter is invalid', () => {
      const consoleSpy = jest.spyOn(console, 'warn');

      Trackingplan.updateTags(null as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Trackingplan: updateTags requires a valid object with string key-value pairs'
      );
    });

    it('should warn when tags parameter is not an object', () => {
      const consoleSpy = jest.spyOn(console, 'warn');

      Trackingplan.updateTags('invalid' as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Trackingplan: updateTags requires a valid object with string key-value pairs'
      );
    });

    it('should handle empty tags object', () => {
      Trackingplan.updateTags({});

      expect(TrackingplanModule.updateTags).toHaveBeenCalledWith({});
    });
  });
});
