package com.trackingplanreactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.trackingplan.client.sdk.Trackingplan

@ReactModule(name = TrackingplanReactNativeModule.NAME)
class TrackingplanReactNativeModule(reactContext: ReactApplicationContext) :
  NativeTrackingplanReactNativeSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun updateTags(tags: ReadableMap) {
    try {
      // Convert ReadableMap to Map<String, String>
      val tagsMap = mutableMapOf<String, String>()
      val iterator = tags.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val value = tags.getString(key)
        if (value != null) {
          tagsMap[key] = value
        }
      }
      
      // Call native Android SDK updateTags method
      Trackingplan.updateTags(tagsMap)
    } catch (e: Exception) {
      // Log error but don't crash the app
      android.util.Log.e(NAME, "Failed to update tags: ${e.message}")
    }
  }

  companion object {
    const val NAME = "TrackingplanReactNative"
  }
}
