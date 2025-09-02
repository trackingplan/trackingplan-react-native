import Foundation
import Trackingplan

@objc(TrackingplanBridge)
public class TrackingplanBridge: NSObject {
    
    @objc
    public static func updateTags(_ tags: [String: String]) {
        Trackingplan.updateTags(tags)
    }
}