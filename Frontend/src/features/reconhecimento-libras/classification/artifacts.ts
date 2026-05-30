import type { LabelsArtifact, NormalizationArtifact } from './types';

export const DEFAULT_CONFIDENCE_THRESHOLD = 0.75;

export const MODEL_ASSET_MODULE_ID = require('../assets/model.onnx') as number;

export const LABELS_ARTIFACT = require('../assets/labels.json') as LabelsArtifact;

export const NORMALIZATION_ARTIFACT = require('../assets/normalization_metadata.json') as NormalizationArtifact;
