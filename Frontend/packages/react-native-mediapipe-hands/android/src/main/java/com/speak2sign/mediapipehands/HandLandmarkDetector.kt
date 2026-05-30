package com.speak2sign.mediapipehands

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.ImageProcessingOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.mrousavy.camera.core.types.Orientation
import java.util.concurrent.ConcurrentHashMap

class HandLandmarkDetector(
  private val numHands: Int,
  private val minHandDetectionConfidence: Float,
  private val minHandPresenceConfidence: Float,
  private val minTrackingConfidence: Float,
  private val currentDelegate: Int,
  private val modelAssetPath: String,
  private val runningMode: RunningMode,
  private val context: Context,
  private var listener: DetectorListener?,
) {
  private var landmarker: HandLandmarker? = null
  private val pendingImageInfo = ConcurrentHashMap<Long, HandLandmarkImageInfo>()

  init {
    setupLandmarker()
  }

  fun clear() {
    listener = null
    Handler(Looper.getMainLooper()).postDelayed(
      {
        landmarker?.close()
        landmarker = null
      },
      100,
    )
  }

  private fun setupLandmarker() {
    val baseOptions = BaseOptions.builder()

    when (currentDelegate) {
      DELEGATE_GPU -> baseOptions.setDelegate(Delegate.GPU)
      else -> baseOptions.setDelegate(Delegate.CPU)
    }

    baseOptions.setModelAssetPath(modelAssetPath)

    if (runningMode == RunningMode.LIVE_STREAM && listener == null) {
      throw IllegalStateException("listener must be set when runningMode is LIVE_STREAM.")
    }

    val optionsBuilder = HandLandmarker.HandLandmarkerOptions.builder()
      .setBaseOptions(baseOptions.build())
      .setNumHands(numHands)
      .setMinHandDetectionConfidence(minHandDetectionConfidence)
      .setMinHandPresenceConfidence(minHandPresenceConfidence)
      .setMinTrackingConfidence(minTrackingConfidence)
      .setRunningMode(runningMode)

    if (runningMode == RunningMode.LIVE_STREAM) {
      optionsBuilder
        .setResultListener(this::returnLivestreamResult)
        .setErrorListener(this::returnLivestreamError)
    }

    try {
      landmarker = HandLandmarker.createFromOptions(context, optionsBuilder.build())
    } catch (error: RuntimeException) {
      listener?.onError(
        "Hand Landmarker failed to initialize. Check that $modelAssetPath is bundled.",
        OTHER_ERROR,
      )
      Log.e(TAG, "Hand Landmarker failed to initialize: ${error.message}")
      throw error
    }
  }

  fun detectLiveStream(mpImage: MPImage, orientation: Orientation) {
    if (runningMode != RunningMode.LIVE_STREAM) {
      throw IllegalArgumentException("detectLiveStream requires RunningMode.LIVE_STREAM.")
    }

    val frameTime = SystemClock.uptimeMillis()
    val imageProcessingOptions = ImageProcessingOptions.builder()
      .setRotationDegrees(orientationToDegrees(orientation))
      .build()

    pendingImageInfo[frameTime] = imageInfoForOrientation(mpImage, orientation)
    landmarker?.detectAsync(mpImage, imageProcessingOptions, frameTime)
  }

  private fun returnLivestreamResult(result: HandLandmarkerResult, input: MPImage) {
    if (result.landmarks().isEmpty()) {
      listener?.onEmpty()
      return
    }

    val inferenceTime = SystemClock.uptimeMillis() - result.timestampMs()
    val imageInfo = pendingImageInfo.remove(result.timestampMs()) ?: HandLandmarkImageInfo(
      orientedHeight = input.height,
      orientedWidth = input.width,
      rawHeight = input.height,
      rawWidth = input.width,
      orientation = Orientation.PORTRAIT.unionValue,
    )
    listener?.onResults(
      ResultBundle(
        listOf(result),
        inferenceTime,
        imageInfo.orientedHeight,
        imageInfo.orientedWidth,
        imageInfo.rawHeight,
        imageInfo.rawWidth,
        imageInfo.orientation,
      ),
    )
  }

  private fun returnLivestreamError(error: RuntimeException) {
    listener?.onError(error.message ?: "An unknown MediaPipe hand-landmarker error occurred.")
  }

  data class ResultBundle(
    val results: List<HandLandmarkerResult>,
    val inferenceTime: Long,
    val inputImageHeight: Int,
    val inputImageWidth: Int,
    val rawInputImageHeight: Int,
    val rawInputImageWidth: Int,
    val inputImageOrientation: String,
  )

  interface DetectorListener {
    fun onError(error: String, errorCode: Int = OTHER_ERROR)
    fun onResults(resultBundle: ResultBundle)
    fun onEmpty() {}
  }

  companion object {
    private const val TAG = "HandLandmarkDetector"
    const val DELEGATE_CPU = 0
    const val DELEGATE_GPU = 1
    const val OTHER_ERROR = 0
  }
}
