import type { InferenceSession } from 'onnxruntime-react-native';
import type { HandLandmark } from '../hand-landmarks';
import type { PredictionStabilizerConfig } from './predictionStabilizer';

export type LabelsArtifact = {
  target_class_order?: string[];
  mvp_class_order: string[];
  model_class_order: string[];
  label_to_index: Record<string, number>;
};

export type NormalizationArtifact = {
  landmark_count: number;
  axes: string[];
  wrist_index: number;
  origin_strategy: string;
  scale_strategy: {
    type: string;
    reference_indices: number[];
    epsilon: number;
  };
  feature_layout: string[];
};

export type GesturePrediction = {
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
  predictedIndex: number;
  inferenceTimeMs: number;
};

export type StabilizedGesturePrediction = {
  label: string;
  confidence: number;
  predictedIndex: number;
  sampleCount: number;
  dominantCount: number;
};

export type GestureClassifierState = {
  modelStatus: 'loading' | 'ready' | 'error';
  prediction: GesturePrediction | null;
  stablePrediction: StabilizedGesturePrediction | null;
  lastError: string | null;
  threshold: number;
  stabilizerConfig: PredictionStabilizerConfig;
};

export type LoadedGestureClassifier = {
  session: InferenceSession;
  inputName: string;
  outputName: string;
};

export type ClassificationInput = {
  landmarks: HandLandmark[];
  timestamp: number;
};
