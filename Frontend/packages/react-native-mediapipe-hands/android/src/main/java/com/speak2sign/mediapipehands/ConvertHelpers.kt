package com.speak2sign.mediapipehands

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.components.containers.Category
import com.google.mediapipe.tasks.components.containers.Landmark
import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.mrousavy.camera.core.types.Orientation

fun convertResultBundleToWritableMap(resultBundle: HandLandmarkDetector.ResultBundle): WritableMap {
  val map = Arguments.createMap()
  val resultsArray = Arguments.createArray()

  resultBundle.results.forEach { result ->
    resultsArray.pushMap(handLandmarkerResultToWritableMap(result))
  }

  map.putArray("results", resultsArray)
  map.putInt("inputImageHeight", resultBundle.inputImageHeight)
  map.putInt("inputImageWidth", resultBundle.inputImageWidth)
  map.putInt("rawInputImageHeight", resultBundle.rawInputImageHeight)
  map.putInt("rawInputImageWidth", resultBundle.rawInputImageWidth)
  map.putString("inputImageOrientation", resultBundle.inputImageOrientation)
  map.putDouble("inferenceTime", resultBundle.inferenceTime.toDouble())
  map.putDouble("timestamp", System.currentTimeMillis().toDouble())

  return map
}

fun handLandmarkerResultToWritableMap(result: HandLandmarkerResult): WritableMap {
  val resultMap = WritableNativeMap()
  val landmarksArray = WritableNativeArray()
  val worldLandmarksArray = WritableNativeArray()
  val handednessArray = WritableNativeArray()

  result.landmarks().forEach { landmarks ->
    val landmarkArray = WritableNativeArray()
    landmarks.forEach { landmarkArray.pushMap(normalizedLandmarkToWritableMap(it)) }
    landmarksArray.pushArray(landmarkArray)
  }

  result.worldLandmarks().forEach { worldLandmarks ->
    val landmarkArray = WritableNativeArray()
    worldLandmarks.forEach { landmarkArray.pushMap(landmarkToWritableMap(it)) }
    worldLandmarksArray.pushArray(landmarkArray)
  }

  result.handednesses().forEach { handedness ->
    val handednessForHand = WritableNativeArray()
    handedness.forEach { handednessForHand.pushMap(categoryToWritableMap(it)) }
    handednessArray.pushArray(handednessForHand)
  }

  resultMap.putArray("landmarks", landmarksArray)
  resultMap.putArray("worldLandmarks", worldLandmarksArray)
  resultMap.putArray("handedness", handednessArray)

  return resultMap
}

fun normalizedLandmarkToWritableMap(landmark: NormalizedLandmark): WritableMap {
  val map = WritableNativeMap()
  map.putDouble("x", landmark.x().toDouble())
  map.putDouble("y", landmark.y().toDouble())
  map.putDouble("z", landmark.z().toDouble())
  return map
}

fun landmarkToWritableMap(landmark: Landmark): WritableMap {
  val map = WritableNativeMap()
  map.putDouble("x", landmark.x().toDouble())
  map.putDouble("y", landmark.y().toDouble())
  map.putDouble("z", landmark.z().toDouble())
  return map
}

fun categoryToWritableMap(category: Category): WritableMap {
  val map = WritableNativeMap()
  map.putString("categoryName", category.categoryName())
  map.putDouble("score", category.score().toDouble())
  return map
}

fun imageOrientation(orientation: String): Orientation? {
  return when (orientation) {
    "portrait" -> Orientation.PORTRAIT
    "portrait-upside-down" -> Orientation.PORTRAIT_UPSIDE_DOWN
    "landscape-left" -> Orientation.LANDSCAPE_LEFT
    "landscape-right" -> Orientation.LANDSCAPE_RIGHT
    else -> null
  }
}

fun orientationToDegrees(orientation: Orientation): Int =
  when (orientation) {
    Orientation.PORTRAIT -> 0
    Orientation.LANDSCAPE_LEFT -> 90
    Orientation.PORTRAIT_UPSIDE_DOWN -> 180
    Orientation.LANDSCAPE_RIGHT -> -90
  }

fun imageInfoForOrientation(
  image: MPImage,
  orientation: Orientation,
): HandLandmarkImageInfo {
  val shouldSwapDimensions = when (orientation) {
    Orientation.LANDSCAPE_LEFT,
    Orientation.LANDSCAPE_RIGHT -> true
    Orientation.PORTRAIT,
    Orientation.PORTRAIT_UPSIDE_DOWN -> false
  }

  return if (shouldSwapDimensions) {
    HandLandmarkImageInfo(
      orientedHeight = image.width,
      orientedWidth = image.height,
      rawHeight = image.height,
      rawWidth = image.width,
      orientation = orientation.unionValue,
    )
  } else {
    HandLandmarkImageInfo(
      orientedHeight = image.height,
      orientedWidth = image.width,
      rawHeight = image.height,
      rawWidth = image.width,
      orientation = orientation.unionValue,
    )
  }
}

data class HandLandmarkImageInfo(
  val orientedHeight: Int,
  val orientedWidth: Int,
  val rawHeight: Int,
  val rawWidth: Int,
  val orientation: String,
)
