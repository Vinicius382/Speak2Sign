import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HandDetectionResult } from '../hand-landmarks';
import { DEFAULT_CONFIDENCE_THRESHOLD } from './artifacts';
import {
  loadGestureClassifier,
  runGestureClassification,
} from './onnxGestureClassifier';
import {
  addPredictionToHistory,
  clearPredictionHistory,
  getStablePrediction,
  isPredictionEligibleForStabilization,
  normalizePredictionStabilizerConfig,
  type PredictionStabilizerConfig,
} from './predictionStabilizer';
import type {
  ClassificationInput,
  GestureClassifierState,
  LoadedGestureClassifier,
  StabilizedGesturePrediction,
} from './types';

type UseRealtimeGestureClassificationOptions = {
  confidenceThreshold?: number;
  stabilizerConfig?: Partial<PredictionStabilizerConfig>;
};

const normalizeConfidenceThreshold = (threshold: number) =>
  Math.min(1, Math.max(0, threshold));

const initialState = (
  threshold: number,
  stabilizerConfig: PredictionStabilizerConfig,
): GestureClassifierState => ({
  modelStatus: 'loading',
  prediction: null,
  stablePrediction: null,
  lastError: null,
  threshold,
  stabilizerConfig,
});

export const useRealtimeGestureClassification = (
  detection: HandDetectionResult | null,
  options: UseRealtimeGestureClassificationOptions = {},
) => {
  const threshold = normalizeConfidenceThreshold(
    options.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD,
  );
  const stabilizerConfig = useMemo(
    () => normalizePredictionStabilizerConfig(options.stabilizerConfig),
    [
      options.stabilizerConfig?.minDominantCount,
      options.stabilizerConfig?.windowSize,
    ],
  );
  const [state, setState] = useState<GestureClassifierState>(() =>
    initialState(threshold, stabilizerConfig),
  );
  const classifierRef = useRef<LoadedGestureClassifier | null>(null);
  const latestInputRef = useRef<ClassificationInput | null>(null);
  const predictionHistoryRef = useRef(clearPredictionHistory());
  const activeTuningRef = useRef({ stabilizerConfig, threshold });
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  activeTuningRef.current = { stabilizerConfig, threshold };

  const updateStabilizedPrediction = useCallback(
    (
      prediction: GestureClassifierState['prediction'],
    ): StabilizedGesturePrediction | null => {
      const activeTuning = activeTuningRef.current;

      if (
        !isPredictionEligibleForStabilization(
          prediction,
          activeTuning.threshold,
        )
      ) {
        predictionHistoryRef.current = clearPredictionHistory();
        return null;
      }

      predictionHistoryRef.current = addPredictionToHistory(
        predictionHistoryRef.current,
        prediction,
        activeTuning.stabilizerConfig,
      );

      return getStablePrediction(
        predictionHistoryRef.current,
        activeTuning.stabilizerConfig,
      );
    },
    [],
  );

  const processLatestInput = useCallback(async () => {
    if (isProcessingRef.current) {
      return;
    }

    const classifier = classifierRef.current;
    const latestInput = latestInputRef.current;

    if (!classifier || !latestInput) {
      return;
    }

    isProcessingRef.current = true;
    const processingTimestamp = latestInput.timestamp;

    try {
      const prediction = await runGestureClassification(
        classifier,
        latestInput.landmarks,
      );

      if (!isMountedRef.current) {
        return;
      }

      const stablePrediction = updateStabilizedPrediction(prediction);

      setState((current) => ({
        ...current,
        modelStatus: 'ready',
        prediction,
        stablePrediction,
        lastError: null,
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to run ONNX gesture inference.';

      if (!isMountedRef.current) {
        return;
      }

      predictionHistoryRef.current = clearPredictionHistory();
      setState((current) => ({
        ...current,
        modelStatus: 'error',
        stablePrediction: null,
        lastError: message,
      }));
    } finally {
      isProcessingRef.current = false;

      if (latestInputRef.current?.timestamp !== processingTimestamp) {
        void processLatestInput();
      }
    }
  }, [updateStabilizedPrediction]);

  useEffect(() => {
    isMountedRef.current = true;

    let active = true;

    loadGestureClassifier()
      .then((classifier) => {
        if (!active) {
          void classifier.session.release();
          return;
        }

        classifierRef.current = classifier;
        setState((current) => ({
          ...current,
          modelStatus: 'ready',
          lastError: null,
        }));
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to load the ONNX gesture classifier.';

        if (!active || !isMountedRef.current) {
          return;
        }

        setState((current) => ({
          ...current,
          modelStatus: 'error',
          lastError: message,
        }));
      });

    return () => {
      active = false;
      isMountedRef.current = false;
      if (classifierRef.current) {
        void classifierRef.current.session.release();
      }
      classifierRef.current = null;
      latestInputRef.current = null;
      predictionHistoryRef.current = clearPredictionHistory();
    };
  }, []);

  useEffect(() => {
    predictionHistoryRef.current = clearPredictionHistory();
    setState((current) => ({
      ...current,
      threshold,
      stabilizerConfig,
      stablePrediction: null,
    }));
  }, [stabilizerConfig, threshold]);

  useEffect(() => {
    if (!detection) {
      latestInputRef.current = null;
      predictionHistoryRef.current = clearPredictionHistory();
      setState((current) => ({
        ...current,
        prediction: null,
        stablePrediction: null,
      }));
      return;
    }

    latestInputRef.current = {
      landmarks: detection.landmarks,
      timestamp: detection.timestamp,
    };

    if (classifierRef.current && state.modelStatus !== 'error') {
      void processLatestInput();
    }
  }, [detection, processLatestInput, state.modelStatus]);

  return useMemo(
    () => ({
      ...state,
      isPredictionConfident:
        !!state.prediction && state.prediction.confidence >= state.threshold,
      hasStablePrediction: !!state.stablePrediction,
    }),
    [state],
  );
};
