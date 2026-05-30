package com.speak2sign.mediapipehands

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.mediapipe.tasks.vision.core.RunningMode

object HandDetectorMap {
  internal val detectorMap = mutableMapOf<Int, HandLandmarkDetector>()
}

class HandLandmarkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var nextId = 100

  override fun getName(): String {
    return "HandLandmarkDetection"
  }

  private class Listener(
    private val module: HandLandmarkModule,
    private val handle: Int,
  ) : HandLandmarkDetector.DetectorListener {
    override fun onError(error: String, errorCode: Int) {
      module.sendErrorEvent(handle, error, errorCode)
    }

    override fun onResults(resultBundle: HandLandmarkDetector.ResultBundle) {
      module.sendResultsEvent(handle, resultBundle)
    }

    override fun onEmpty() {
      module.sendEmptyEvent(handle)
    }
  }

  @ReactMethod
  fun createDetector(
    numHands: Int,
    minHandDetectionConfidence: Float,
    minHandPresenceConfidence: Float,
    minTrackingConfidence: Float,
    modelAssetPath: String,
    delegate: Int,
    runningMode: Int,
    promise: Promise,
  ) {
    try {
      val id = nextId++
      val detector = HandLandmarkDetector(
        numHands = numHands,
        minHandDetectionConfidence = minHandDetectionConfidence,
        minHandPresenceConfidence = minHandPresenceConfidence,
        minTrackingConfidence = minTrackingConfidence,
        currentDelegate = delegate,
        modelAssetPath = modelAssetPath,
        runningMode = enumValues<RunningMode>().first { it.ordinal == runningMode },
        context = reactApplicationContext.applicationContext,
        listener = Listener(this, id),
      )

      HandDetectorMap.detectorMap[id] = detector
      promise.resolve(id)
    } catch (error: Throwable) {
      promise.reject("hand_landmarker_init_failed", error)
    }
  }

  @ReactMethod
  fun releaseDetector(handle: Int, promise: Promise) {
    HandDetectorMap.detectorMap[handle]?.clear()
    HandDetectorMap.detectorMap.remove(handle)
    promise.resolve(true)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    // Required by React Native event emitters.
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    // Required by React Native event emitters.
  }

  private fun sendResultsEvent(handle: Int, bundle: HandLandmarkDetector.ResultBundle) {
    val resultArgs = convertResultBundleToWritableMap(bundle)
    resultArgs.putInt("handle", handle)

    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onHandLandmarks", resultArgs)
  }

  private fun sendEmptyEvent(handle: Int) {
    val resultArgs = Arguments.createMap()
    resultArgs.putInt("handle", handle)

    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onHandLandmarksEmpty", resultArgs)
  }

  private fun sendErrorEvent(handle: Int, message: String, code: Int) {
    val errorArgs = Arguments.makeNativeMap(
      mapOf("handle" to handle, "message" to message, "code" to code),
    )

    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onHandLandmarkError", errorArgs)
  }
}
