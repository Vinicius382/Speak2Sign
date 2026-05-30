import { HAND_LANDMARK_COUNT } from './handConnections';
import type {
  FrameOrientation,
  FrameSize,
  HandDetectionResult,
  HandLandmark,
} from './types';

type FrameInfo = {
  width: number;
  height: number;
  timestamp: number;
  orientation?: FrameOrientation;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const asNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const normalizeLandmark = (value: unknown): HandLandmark | null => {
  if (Array.isArray(value)) {
    const x = asNumber(value[0]);
    const y = asNumber(value[1]);
    const z = asNumber(value[2]) ?? 0;

    return x === null || y === null ? null : { x, y, z };
  }

  if (!isRecord(value)) {
    return null;
  }

  const x = asNumber(value.x);
  const y = asNumber(value.y);
  const z = asNumber(value.z) ?? 0;

  return x === null || y === null ? null : { x, y, z };
};

const normalizeLandmarkList = (value: unknown): HandLandmark[] | null => {
  if (!Array.isArray(value) || value.length !== HAND_LANDMARK_COUNT) {
    return null;
  }

  const landmarks = value.map(normalizeLandmark);

  return landmarks.every((landmark): landmark is HandLandmark => landmark !== null)
    ? landmarks
    : null;
};

const orientLandmark = (
  landmark: HandLandmark,
  orientation: FrameOrientation | undefined,
): HandLandmark => {
  switch (orientation) {
    case 'landscape-left':
      return { x: landmark.y, y: 1 - landmark.x, z: landmark.z };
    case 'landscape-right':
      return { x: 1 - landmark.y, y: landmark.x, z: landmark.z };
    case 'portrait-upside-down':
      return { x: 1 - landmark.x, y: 1 - landmark.y, z: landmark.z };
    case 'portrait':
    case undefined:
      return landmark;
  }
};

const getCandidateLandmarkLists = (raw: unknown): unknown[] => {
  if (!isRecord(raw)) {
    return [raw];
  }

  return [
    raw.landmarks,
    raw.handLandmarks,
    raw.multiHandLandmarks,
    raw.hands,
    raw.results,
    raw.detections,
  ];
};

const firstLandmarkList = (raw: unknown): HandLandmark[] | null => {
  for (const candidate of getCandidateLandmarkLists(raw)) {
    const direct = normalizeLandmarkList(candidate);

    if (direct) {
      return direct;
    }

    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const nested = normalizeLandmarkList(item);

        if (nested) {
          return nested;
        }

        if (isRecord(item)) {
          const fromItem = firstLandmarkList(item);

          if (fromItem) {
            return fromItem;
          }
        }
      }
    }
  }

  return null;
};

const normalizeHandedness = (raw: unknown): HandDetectionResult['handedness'] => {
  if (!isRecord(raw)) {
    return undefined;
  }

  const candidate = raw.handedness ?? raw.label ?? raw.categoryName;

  if (candidate === 'Left' || candidate === 'Right') {
    return candidate;
  }

  return candidate ? 'Unknown' : undefined;
};

const normalizeConfidence = (raw: unknown): number | undefined => {
  if (!isRecord(raw)) {
    return undefined;
  }

  return asNumber(raw.confidence ?? raw.score) ?? undefined;
};

export const normalizeMediaPipeResult = (
  raw: unknown,
  frameInfo: FrameInfo,
): HandDetectionResult | null => {
  const landmarks = firstLandmarkList(raw);

  if (!landmarks) {
    return null;
  }

  const frameSize: FrameSize = {
    width: frameInfo.width,
    height: frameInfo.height,
  };
  const orientedLandmarks = landmarks.map((landmark) =>
    orientLandmark(landmark, frameInfo.orientation),
  );

  return {
    landmarks: orientedLandmarks,
    handedness: normalizeHandedness(raw),
    confidence: normalizeConfidence(raw),
    timestamp: frameInfo.timestamp,
    frameSize,
    frameOrientation: frameInfo.orientation,
  };
};
