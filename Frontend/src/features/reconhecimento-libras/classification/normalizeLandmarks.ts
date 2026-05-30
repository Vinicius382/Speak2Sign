import type { HandLandmark } from '../hand-landmarks';
import { NORMALIZATION_ARTIFACT } from './artifacts';

const LANDMARK_COUNT = NORMALIZATION_ARTIFACT.landmark_count;
const WRIST_INDEX = NORMALIZATION_ARTIFACT.wrist_index;
const REFERENCE_INDICES = NORMALIZATION_ARTIFACT.scale_strategy.reference_indices;
const SCALE_EPSILON = NORMALIZATION_ARTIFACT.scale_strategy.epsilon;
const FEATURE_COUNT = NORMALIZATION_ARTIFACT.feature_layout.length;

const toCoordinateTriplets = (landmarks: HandLandmark[]) => {
  if (landmarks.length !== LANDMARK_COUNT) {
    throw new Error(
      `Expected ${LANDMARK_COUNT} landmarks, received ${landmarks.length}.`,
    );
  }

  return landmarks.map((landmark) => ({
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
  }));
};

const computeHandScale = (
  coordinates: ReturnType<typeof toCoordinateTriplets>,
): number => {
  const wrist = coordinates[WRIST_INDEX];

  if (!wrist) {
    throw new Error(`Wrist landmark ${WRIST_INDEX} is missing.`);
  }

  const distances = REFERENCE_INDICES.map((index) => {
    const point = coordinates[index];

    if (!point) {
      throw new Error(`Reference landmark ${index} is missing.`);
    }

    const dx = point.x - wrist.x;
    const dy = point.y - wrist.y;
    const dz = point.z - wrist.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  });

  const scale =
    distances.reduce((total, distance) => total + distance, 0) / distances.length;

  if (!Number.isFinite(scale) || scale <= SCALE_EPSILON) {
    throw new Error('Computed hand scale is invalid or too small.');
  }

  return scale;
};

export const normalizeLandmarks = (
  landmarks: HandLandmark[],
): Float32Array => {
  const coordinates = toCoordinateTriplets(landmarks);
  const wrist = coordinates[WRIST_INDEX];

  if (!wrist) {
    throw new Error(`Wrist landmark ${WRIST_INDEX} is missing.`);
  }

  const scale = computeHandScale(coordinates);
  const normalized = new Float32Array(FEATURE_COUNT);

  coordinates.forEach((point, index) => {
    const offset = index * 3;
    normalized[offset] = (point.x - wrist.x) / scale;
    normalized[offset + 1] = (point.y - wrist.y) / scale;
    normalized[offset + 2] = (point.z - wrist.z) / scale;
  });

  return normalized;
};
