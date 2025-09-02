#import "TrackingplanReactNative.h"

// Import the generated Swift header for our module
#if __has_include("TrackingplanReactNative-Swift.h")
#import "TrackingplanReactNative-Swift.h"
#else
#import <TrackingplanReactNative/TrackingplanReactNative-Swift.h>
#endif

@implementation TrackingplanReactNative
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(updateTags:(NSDictionary *)tags)
{
    @try {
        // Convert NSDictionary to Swift Dictionary<String, String>
        NSMutableDictionary<NSString *, NSString *> *tagsDict = [[NSMutableDictionary alloc] init];
        for (NSString *key in tags) {
            id value = tags[key];
            if ([value isKindOfClass:[NSString class]]) {
                tagsDict[key] = (NSString *)value;
            }
        }

        // Call native iOS SDK updateTags method through our bridge
        [TrackingplanBridge updateTags:tagsDict];
    } @catch (NSException *exception) {
        // Log error but don't crash the app
        NSLog(@"TrackingplanReactNative: Failed to update tags: %@", exception.reason);
    }
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeTrackingplanReactNativeSpecJSI>(params);
}

@end
