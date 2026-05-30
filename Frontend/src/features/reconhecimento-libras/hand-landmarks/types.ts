export type HandLandmark = {
  x: number;
  y: number;
  z: number;
};

export type FrameOrientation =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape-left'
  | 'landscape-right';

export type FrameSize = {
  /**
   * Image-space size used by MediaPipe normalized landmarks after camera
   * orientation has been applied. This is the size the overlay should map from.
   */
  width: number;
  height: number;
};

export type HandDetectionResult = {
  landmarks: HandLandmark[];
  handedness?: 'Left' | 'Right' | 'Unknown';
  confidence?: number;
  timestamp: number;
  frameSize: FrameSize;
  frameOrientation?: FrameOrientation;
};

export type HandLandmarkProviderStatus =
  | 'idle'
  | 'running'
  | 'no-hand'
  | 'unsupported'
  | 'error';

export type HandLandmarkProviderState = {
  status: HandLandmarkProviderStatus;
  result: HandDetectionResult | null;
  lastError: string | null;
};
