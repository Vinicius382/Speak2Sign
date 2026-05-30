import { Asset } from 'expo-asset';
import {
  InferenceSession,
  Tensor,
} from 'onnxruntime-react-native';
import type { HandLandmark } from '../hand-landmarks';
import {
  LABELS_ARTIFACT,
  MODEL_ASSET_MODULE_ID,
  NORMALIZATION_ARTIFACT,
} from './artifacts';
import { normalizeLandmarks } from './normalizeLandmarks';
import type {
  GesturePrediction,
  LoadedGestureClassifier,
} from './types';

const toBundledModelPath = async (): Promise<string> => {
  const [asset] = await Asset.loadAsync(MODEL_ASSET_MODULE_ID);
  const modelPath = asset?.localUri ?? asset?.uri;

  if (!modelPath) {
    throw new Error('Failed to resolve the bundled ONNX model path.');
  }

  return modelPath;
};

const isTensor = (value: unknown): value is Tensor => value instanceof Tensor;

const getTensorData = (tensor: Tensor): readonly unknown[] => {
  if (!Array.isArray(tensor.dims) || tensor.dims.length === 0) {
    return Array.from(tensor.data as ArrayLike<unknown>);
  }

  return Array.from(tensor.data as ArrayLike<unknown>);
};

const looksLikeProbabilityVector = (values: number[]) => {
  const sum = values.reduce((total, value) => total + value, 0);

  return values.every((value) => value >= 0 && value <= 1) && Math.abs(sum - 1) < 1e-3;
};

const softmax = (values: number[]) => {
  const maxValue = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - maxValue));
  const sum = exps.reduce((total, value) => total + value, 0);

  return exps.map((value) => value / sum);
};

const selectProbabilityOutput = (
  session: InferenceSession,
  outputs: Awaited<ReturnType<InferenceSession['run']>>,
): { outputName: string; values: number[] } => {
  const classCount = LABELS_ARTIFACT.model_class_order.length;

  for (const outputName of session.outputNames) {
    const output = outputs[outputName];

    if (!isTensor(output) || output.type !== 'float32') {
      continue;
    }

    const data = getTensorData(output)
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (data.length === classCount) {
      return { outputName, values: data };
    }

    if (data.length > classCount) {
      return { outputName, values: data.slice(data.length - classCount) };
    }
  }

  throw new Error(
    `No float output compatible with ${classCount} classes was produced by the ONNX model.`,
  );
};

const validateArtifacts = () => {
  if (
    NORMALIZATION_ARTIFACT.landmark_count !== 21 ||
    NORMALIZATION_ARTIFACT.feature_layout.length !== 63
  ) {
    throw new Error('Normalization metadata is incompatible with the mobile runtime.');
  }

  if (
    LABELS_ARTIFACT.model_class_order.length !==
    Object.keys(LABELS_ARTIFACT.label_to_index).length
  ) {
    throw new Error('labels.json has inconsistent class metadata.');
  }
};

export const loadGestureClassifier = async (): Promise<LoadedGestureClassifier> => {
  validateArtifacts();

  const modelPath = await toBundledModelPath();
  const session = await InferenceSession.create(modelPath);
  const [inputName] = session.inputNames;

  if (!inputName) {
    throw new Error('The ONNX model does not expose an input tensor.');
  }

  return {
    session,
    inputName,
    outputName: session.outputNames[0] ?? 'output',
  };
};

export const runGestureClassification = async (
  classifier: LoadedGestureClassifier,
  landmarks: HandLandmark[],
): Promise<GesturePrediction> => {
  const startedAt = globalThis.performance?.now?.() ?? Date.now();
  const normalizedFeatures = normalizeLandmarks(landmarks);
  const inputTensor = new Tensor('float32', normalizedFeatures, [1, 63]);
  const outputs = await classifier.session.run({
    [classifier.inputName]: inputTensor,
  });

  const { outputName, values } = selectProbabilityOutput(classifier.session, outputs);
  const probabilities = looksLikeProbabilityVector(values) ? values : softmax(values);

  let predictedIndex = 0;
  let bestConfidence = probabilities[0] ?? 0;

  probabilities.forEach((value, index) => {
    if (value > bestConfidence) {
      predictedIndex = index;
      bestConfidence = value;
    }
  });

  const label = LABELS_ARTIFACT.model_class_order[predictedIndex];

  if (!label) {
    throw new Error(`Predicted class index ${predictedIndex} is outside labels.json.`);
  }

  const endedAt = globalThis.performance?.now?.() ?? Date.now();

  return {
    label,
    confidence: bestConfidence,
    probabilities: Object.fromEntries(
      LABELS_ARTIFACT.model_class_order.map((candidate, index) => [
        candidate,
        probabilities[index] ?? 0,
      ]),
    ),
    predictedIndex,
    inferenceTimeMs: endedAt - startedAt,
  };
};
