package com.speak2sign.mediapipehands

import com.google.mediapipe.framework.image.MediaImageBuilder
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin

class HandLandmarkFrameProcessorPlugin : FrameProcessorPlugin() {
  override fun callback(frame: Frame, params: MutableMap<String, Any>?): Any {
    val detectorHandle = (params?.get("detectorHandle") as? Double)?.toInt() ?: return false
    val detector = HandDetectorMap.detectorMap[detectorHandle] ?: return false
    val orientation = imageOrientation(params["orientation"] as? String ?: "portrait") ?: return false
    val mpImage = MediaImageBuilder(frame.image).build()

    detector.detectLiveStream(mpImage, orientation)

    return true
  }
}
