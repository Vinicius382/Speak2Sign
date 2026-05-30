import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';

export type HandLandmarkDetectionEvent = {
  handle: number;
  results?: unknown[];
  inputImageHeight?: number;
  inputImageWidth?: number;
  inputImageOrientation?:
    | 'portrait'
    | 'portrait-upside-down'
    | 'landscape-left'
    | 'landscape-right';
  rawInputImageHeight?: number;
  rawInputImageWidth?: number;
  inferenceTime?: number;
  timestamp?: number;
};

export type HandLandmarkDetectionError = {
  handle: number;
  message: string;
  code: number;
};

type HandLandmarkDetectionModule = {
  addListener: (eventName: string) => void;
  createDetector: (
    numHands: number,
    minHandDetectionConfidence: number,
    minHandPresenceConfidence: number,
    minTrackingConfidence: number,
    modelAssetPath: string,
    delegate: number,
    runningMode: number,
  ) => Promise<number>;
  releaseDetector: (handle: number) => Promise<boolean>;
  removeListeners: (count: number) => void;
};

const nativeModule = NativeModules.HandLandmarkDetection as
  | HandLandmarkDetectionModule
  | undefined;

const plugin = VisionCameraProxy.initFrameProcessorPlugin(
  'handLandmarkDetection',
  {},
);

const eventEmitter = nativeModule ? new NativeEventEmitter(nativeModule) : null;

export const isHandLandmarkDetectionSupported =
  Platform.OS === 'android' && nativeModule !== undefined && plugin !== undefined;

export const createHandLandmarkDetector = async () => {
  if (!nativeModule) {
    throw new Error('Native HandLandmarkDetection module is not available.');
  }

  return nativeModule.createDetector(
    1,
    0.5,
    0.5,
    0.5,
    'hand_landmarker.task',
    0,
    2,
  );
};

export const releaseHandLandmarkDetector = async (handle: number) => {
  if (!nativeModule) {
    return false;
  }

  return nativeModule.releaseDetector(handle);
};

export const detectHandLandmarksInFrame = (
  frame: Frame,
  detectorHandle: number,
) => {
  'worklet';

  return plugin?.call(frame, {
    detectorHandle,
    orientation: frame.orientation,
  });
};

export const addHandLandmarksListener = (
  listener: (event: HandLandmarkDetectionEvent) => void,
) => eventEmitter?.addListener('onHandLandmarks', listener);

export const addHandLandmarksEmptyListener = (
  listener: (event: { handle: number }) => void,
) => eventEmitter?.addListener('onHandLandmarksEmpty', listener);

export const addHandLandmarkErrorListener = (
  listener: (event: HandLandmarkDetectionError) => void,
) => eventEmitter?.addListener('onHandLandmarkError', listener);
