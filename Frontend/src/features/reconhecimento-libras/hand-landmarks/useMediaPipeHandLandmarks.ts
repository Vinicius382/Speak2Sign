import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Frame } from 'react-native-vision-camera';
import { runAtTargetFps, useFrameProcessor } from 'react-native-vision-camera';
import {
  addHandLandmarkErrorListener,
  addHandLandmarksEmptyListener,
  addHandLandmarksListener,
  createHandLandmarkDetector,
  detectHandLandmarksInFrame,
  isHandLandmarkDetectionSupported,
  releaseHandLandmarkDetector,
  type HandLandmarkDetectionEvent,
} from '@speak2sign/react-native-mediapipe-hands';
import { normalizeMediaPipeResult } from './normalizeMediaPipeResult';
import type { HandLandmarkProviderState } from './types';

type UseMediaPipeHandLandmarksOptions = {
  resetKey?: unknown;
  targetFps?: number;
};

const initialState: HandLandmarkProviderState = {
  status: 'idle',
  result: null,
  lastError: null,
};

export const useMediaPipeHandLandmarks = (
  options: UseMediaPipeHandLandmarksOptions = {},
) => {
  const resetKey = options.resetKey;
  const targetFps = options.targetFps ?? 12;
  const [state, setState] = useState<HandLandmarkProviderState>(initialState);
  const [detectorHandle, setDetectorHandle] = useState<number | null>(null);

  const handleDetection = useCallback((event: HandLandmarkDetectionEvent) => {
    if (!event.results?.length) {
      setState({
        status: 'no-hand',
        result: null,
        lastError: null,
      });
      return;
    }

    const result = normalizeMediaPipeResult(event.results[0], {
      width: event.inputImageWidth ?? 1,
      height: event.inputImageHeight ?? 1,
      timestamp: event.timestamp ?? Date.now(),
      orientation: event.inputImageOrientation,
    });

    setState({
      status: result ? 'running' : 'no-hand',
      result,
      lastError: null,
    });
  }, []);

  const handleProcessorError = useCallback((message: string) => {
    setState((current) => ({
      status: 'error',
      result: current.result,
      lastError: message,
    }));
  }, []);

  useEffect(() => {
    if (!isHandLandmarkDetectionSupported) {
      setState({
        status: 'unsupported',
        result: null,
        lastError:
          'Android HandLandmarker native module is not available in this build.',
      });
      return undefined;
    }

    let active = true;
    let createdHandle: number | null = null;

    createHandLandmarkDetector()
      .then((handle) => {
        if (!active) {
          releaseHandLandmarkDetector(handle);
          return;
        }

        createdHandle = handle;
        setDetectorHandle(handle);
        setState({
          status: 'no-hand',
          result: null,
          lastError: null,
        });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create MediaPipe hand detector.';

        handleProcessorError(message);
      });

    const resultSubscription = addHandLandmarksListener((event) => {
      if (event.handle === createdHandle) {
        handleDetection(event);
      }
    });
    const emptySubscription = addHandLandmarksEmptyListener((event) => {
      if (event.handle === createdHandle) {
        setState({
          status: 'no-hand',
          result: null,
          lastError: null,
        });
      }
    });
    const errorSubscription = addHandLandmarkErrorListener((event) => {
      if (event.handle === createdHandle) {
        handleProcessorError(event.message);
      }
    });

    return () => {
      active = false;
      resultSubscription?.remove();
      emptySubscription?.remove();
      errorSubscription?.remove();

      if (createdHandle !== null) {
        releaseHandLandmarkDetector(createdHandle);
      }
    };
  }, [handleDetection, handleProcessorError]);

  useEffect(() => {
    setState((current) => ({
      status:
        current.status === 'idle' ||
        current.status === 'unsupported' ||
        current.status === 'error'
          ? current.status
          : 'no-hand',
      result: null,
      lastError:
        current.status === 'unsupported' || current.status === 'error'
          ? current.lastError
          : null,
    }));
  }, [resetKey]);

  const frameProcessor = useFrameProcessor(
    (frame: Frame) => {
      'worklet';

      runAtTargetFps(targetFps, () => {
        'worklet';

        if (detectorHandle !== null) {
          detectHandLandmarksInFrame(frame, detectorHandle);
        }
      });
    },
    [detectorHandle, targetFps],
  );

  return useMemo(
    () => ({
      frameProcessor,
      state,
    }),
    [frameProcessor, state],
  );
};
