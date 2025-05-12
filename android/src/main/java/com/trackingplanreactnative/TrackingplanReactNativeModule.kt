package com.trackingplanreactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = TrackingplanReactNativeModule.NAME)
class TrackingplanReactNativeModule(reactContext: ReactApplicationContext) :
  NativeTrackingplanReactNativeSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "TrackingplanReactNative"
  }
}
