import type {
  GesturePrediction,
  StabilizedGesturePrediction,
} from './types';

export type PredictionStabilizerConfig = {
  windowSize: number;
  minDominantCount: number;
};

export type PredictionHistoryEntry = Pick<
  GesturePrediction,
  'label' | 'confidence' | 'predictedIndex'
>;

type PredictionStats = {
  confidenceTotal: number;
  count: number;
  predictedIndex: number;
};

// Keep these knobs together so the MVP can tune stability without changing UI code.
export const DEFAULT_PREDICTION_STABILIZER_CONFIG: PredictionStabilizerConfig = {
  windowSize: 5,
  minDominantCount: 3,
};

export const clearPredictionHistory = (): PredictionHistoryEntry[] => [];

export const normalizePredictionStabilizerConfig = (
  config: Partial<PredictionStabilizerConfig> = {},
): PredictionStabilizerConfig => {
  const requestedWindowSize =
    config.windowSize ?? DEFAULT_PREDICTION_STABILIZER_CONFIG.windowSize;
  const windowSize = Math.max(1, Math.round(requestedWindowSize));
  const requestedMinDominantCount =
    config.minDominantCount ??
    DEFAULT_PREDICTION_STABILIZER_CONFIG.minDominantCount;
  const minDominantCount = Math.min(
    windowSize,
    Math.max(1, Math.round(requestedMinDominantCount)),
  );

  return {
    windowSize,
    minDominantCount,
  };
};

export const isPredictionEligibleForStabilization = (
  prediction: GesturePrediction | null,
  threshold: number,
): prediction is GesturePrediction => {
  return (
    !!prediction &&
    prediction.label !== 'NONE' &&
    prediction.confidence >= threshold
  );
};

export const addPredictionToHistory = (
  history: readonly PredictionHistoryEntry[],
  prediction: GesturePrediction,
  config: PredictionStabilizerConfig = DEFAULT_PREDICTION_STABILIZER_CONFIG,
): PredictionHistoryEntry[] => {
  const normalizedConfig = normalizePredictionStabilizerConfig(config);
  const nextHistory = [
    ...history,
    {
      label: prediction.label,
      confidence: prediction.confidence,
      predictedIndex: prediction.predictedIndex,
    },
  ];

  return nextHistory.slice(-normalizedConfig.windowSize);
};

export const getStablePrediction = (
  history: readonly PredictionHistoryEntry[],
  config: PredictionStabilizerConfig = DEFAULT_PREDICTION_STABILIZER_CONFIG,
): StabilizedGesturePrediction | null => {
  const normalizedConfig = normalizePredictionStabilizerConfig(config);
  const counts = new Map<string, PredictionStats>();

  history.forEach((entry) => {
    const current = counts.get(entry.label) ?? {
      confidenceTotal: 0,
      count: 0,
      predictedIndex: entry.predictedIndex,
    };

    counts.set(entry.label, {
      confidenceTotal: current.confidenceTotal + entry.confidence,
      count: current.count + 1,
      predictedIndex: current.predictedIndex,
    });
  });

  let dominantLabel: string | null = null;
  let dominantStats: PredictionStats | null = null;

  for (const [label, stats] of counts) {
    if (!dominantStats || stats.count > dominantStats.count) {
      dominantLabel = label;
      dominantStats = stats;
    }
  }

  if (
    !dominantLabel ||
    !dominantStats ||
    dominantStats.count < normalizedConfig.minDominantCount
  ) {
    return null;
  }

  return {
    label: dominantLabel,
    confidence: dominantStats.confidenceTotal / dominantStats.count,
    predictedIndex: dominantStats.predictedIndex,
    sampleCount: history.length,
    dominantCount: dominantStats.count,
  };
};
