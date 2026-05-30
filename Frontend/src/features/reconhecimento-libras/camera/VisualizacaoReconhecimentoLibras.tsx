import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  DEFAULT_CONFIDENCE_THRESHOLD,
  DEFAULT_PREDICTION_STABILIZER_CONFIG,
  useRealtimeGestureClassification,
} from '../classification';
import type { Cores } from '../../../theme/cores';
import { useMediaPipeHandLandmarks } from '../hand-landmarks';
import { HandLandmarkOverlay, type PreviewSize } from '../overlay';

type CameraPosition = 'back' | 'front';

type VisualizacaoReconhecimentoLibrasProps = {
  fontScale?: number;
  theme: Cores;
};

const DEFAULT_TUNING_SETTINGS = {
  confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
  stabilizerMinDominantCount:
    DEFAULT_PREDICTION_STABILIZER_CONFIG.minDominantCount,
  stabilizerWindowSize: DEFAULT_PREDICTION_STABILIZER_CONFIG.windowSize,
};

export const VisualizacaoReconhecimentoLibras = ({
  fontScale = 1,
  theme,
}: VisualizacaoReconhecimentoLibrasProps) => {
  const styles = useMemo(
    () => createStyles(theme, fontScale),
    [fontScale, theme],
  );
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const [previewSize, setPreviewSize] = useState<PreviewSize>({
    width: 0,
    height: 0,
  });
  const backDevice = useCameraDevice('back');
  const frontDevice = useCameraDevice('front');
  const device =
    cameraPosition === 'front' ? frontDevice ?? backDevice : backDevice ?? frontDevice;
  const activeCameraPosition: CameraPosition =
    device?.position === 'front' ? 'front' : 'back';
  const canSwitchCamera = !!backDevice && !!frontDevice;
  const { hasPermission, requestPermission } = useCameraPermission();
  const { frameProcessor, state } = useMediaPipeHandLandmarks({
    resetKey: activeCameraPosition,
    targetFps: 12,
  });
  const classification = useRealtimeGestureClassification(state.result, {
    confidenceThreshold: DEFAULT_TUNING_SETTINGS.confidenceThreshold,
    stabilizerConfig: {
      minDominantCount: DEFAULT_TUNING_SETTINGS.stabilizerMinDominantCount,
      windowSize: DEFAULT_TUNING_SETTINGS.stabilizerWindowSize,
    },
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setPreviewSize({ width, height });
  };

  const handleSwitchCamera = useCallback(() => {
    if (!canSwitchCamera) {
      return;
    }

    setCameraPosition((current) => (current === 'back' ? 'front' : 'back'));
  }, [canSwitchCamera]);

  const hasHand = state.status === 'running' && !!state.result;
  const prediction = classification.prediction;
  const stablePrediction = classification.stablePrediction;
  const isPredictionConfident = classification.isPredictionConfident;
  const shouldFallbackToNone = prediction?.label === 'NONE';
  const isWaitingForStablePrediction =
    !!prediction &&
    isPredictionConfident &&
    !shouldFallbackToNone &&
    !stablePrediction;
  const hasError = !!state.lastError || !!classification.lastError;
  const predictionLabel = stablePrediction ? stablePrediction.label : '--';
  const displayConfidence = stablePrediction?.confidence ?? prediction?.confidence;
  const confidenceLabel =
    displayConfidence !== undefined
      ? `${(displayConfidence * 100).toFixed(0)}%`
      : '--';
  const status = getRecognitionStatus({
    hasError,
    hasHand,
    isPredictionConfident,
    isWaitingForStablePrediction,
    modelStatus: classification.modelStatus,
    prediction,
    shouldFallbackToNone,
  });
  const feedbackMessage = (() => {
    if (state.lastError) {
      return state.lastError;
    }

    if (classification.lastError) {
      return classification.lastError;
    }

    if (!hasHand) {
      return 'Posicione uma mao dentro da area da camera.';
    }

    if (classification.modelStatus === 'loading') {
      return 'Preparando reconhecimento...';
    }

    if (!prediction) {
      return 'Aguardando a primeira previsao.';
    }

    if (shouldFallbackToNone) {
      return 'Nenhuma letra reconhecida.';
    }

    if (!isPredictionConfident) {
      return 'Ainda nao reconheci com seguranca.';
    }

    if (isWaitingForStablePrediction) {
      return 'Mantenha a mao parada por um instante.';
    }

    return 'Letra reconhecida.';
  })();

  if (!hasPermission) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>CAM</Text>
        </View>
        <Text style={styles.emptyTitle}>Permita o acesso a camera</Text>
        <Text style={styles.emptyCopy}>
          O reconhecimento usa a camera do celular para identificar letras em Libras em tempo real.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={requestPermission}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Permitir acesso</Text>
        </Pressable>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.emptyCard}>
        <ActivityIndicator color={theme.destaque} size="large" />
        <Text style={styles.emptyTitle}>Procurando camera</Text>
        <Text style={styles.emptyCopy}>
          Nao encontramos uma camera disponivel neste dispositivo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.featureArea}>
      <View style={styles.cameraCard} onLayout={handleLayout}>
        <Camera
          device={device}
          frameProcessor={frameProcessor}
          isActive
          pixelFormat="rgb"
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.cameraScrim} />
        <HandLandmarkOverlay
          connectionColor={theme.iconeTeal}
          detection={state.result}
          landmarkColor="#FFFFFF"
          mirrored={activeCameraPosition === 'front'}
          previewSize={previewSize}
          wristColor="#FBBF24"
        />
        {canSwitchCamera ? (
          <Pressable
            accessibilityHint="Alterna entre camera traseira e frontal."
            accessibilityLabel="Trocar camera"
            accessibilityRole="button"
            onPress={handleSwitchCamera}
            style={styles.cameraSwitchButton}
          >
            <Text style={styles.cameraSwitchText}>Trocar</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={[styles.statusPill, styles[status.variant]]}>
            <Text style={[styles.statusPillText, styles[`${status.variant}Text`]]}>
              {status.label}
            </Text>
          </View>
          <Text style={styles.cameraLabel}>
            Camera {activeCameraPosition === 'front' ? 'frontal' : 'traseira'}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.primaryMetric}>
            <Text style={styles.metricLabel}>Letra</Text>
            <Text style={styles.predictionValue}>{predictionLabel}</Text>
          </View>
          <View style={styles.secondaryMetric}>
            <Text style={styles.metricLabel}>Confianca</Text>
            <Text style={styles.confidenceValue}>{confidenceLabel}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.feedbackText,
            hasError ? styles.feedbackError : null,
          ]}
        >
          {feedbackMessage}
        </Text>
      </View>
    </View>
  );
};

type RecognitionStatusInput = {
  hasError: boolean;
  hasHand: boolean;
  isPredictionConfident: boolean;
  isWaitingForStablePrediction: boolean;
  modelStatus: 'loading' | 'ready' | 'error';
  prediction: { label: string } | null;
  shouldFallbackToNone: boolean;
};

type StatusVariant = 'errorPill' | 'neutralPill' | 'successPill' | 'warningPill';

const getRecognitionStatus = ({
  hasError,
  hasHand,
  isPredictionConfident,
  isWaitingForStablePrediction,
  modelStatus,
  prediction,
  shouldFallbackToNone,
}: RecognitionStatusInput): { label: string; variant: StatusVariant } => {
  if (hasError || modelStatus === 'error') {
    return { label: 'Atencao', variant: 'errorPill' };
  }

  if (modelStatus === 'loading') {
    return { label: 'Preparando', variant: 'neutralPill' };
  }

  if (!hasHand) {
    return { label: 'Sem mao', variant: 'neutralPill' };
  }

  if (!prediction || shouldFallbackToNone || !isPredictionConfident) {
    return { label: 'Ajuste a mao', variant: 'warningPill' };
  }

  if (isWaitingForStablePrediction) {
    return { label: 'Estabilizando', variant: 'warningPill' };
  }

  return { label: 'Reconhecida', variant: 'successPill' };
};

const createStyles = (
  theme: Cores,
  fontScale: number,
) => StyleSheet.create({
  featureArea: {
    flex: 1,
    gap: 16,
  },
  cameraCard: {
    backgroundColor: '#101820',
    borderColor: theme.inputBorda,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 360,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: theme.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  cameraSwitchButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(224,224,224,0.95)',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
    position: 'absolute',
    right: 12,
    top: 12,
  },
  cameraSwitchText: {
    color: '#1A1A2E',
    fontSize: Math.round(13 * fontScale),
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: theme.superficie,
    borderColor: theme.inputBorda,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: theme.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  statusPillText: {
    fontSize: Math.round(12 * fontScale),
    fontWeight: '700',
  },
  neutralPill: {
    backgroundColor: theme.fundoIcone,
  },
  neutralPillText: {
    color: theme.iconeTeal,
  },
  warningPill: {
    backgroundColor: '#FFFBEB',
  },
  warningPillText: {
    color: '#B45309',
  },
  successPill: {
    backgroundColor: '#F0F8F0',
  },
  successPillText: {
    color: theme.destaque,
  },
  errorPill: {
    backgroundColor: '#FFF5F5',
  },
  errorPillText: {
    color: theme.erro,
  },
  cameraLabel: {
    color: theme.textoSuave,
    fontSize: Math.round(12 * fontScale),
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryMetric: {
    backgroundColor: theme.fundoIcone,
    borderRadius: 14,
    flex: 1,
    minHeight: 104,
    padding: 14,
  },
  secondaryMetric: {
    backgroundColor: theme.inputFundo,
    borderColor: theme.inputBorda,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 104,
    padding: 14,
    width: 124,
  },
  metricLabel: {
    color: theme.textoSecundario,
    fontSize: Math.round(12 * fontScale),
    fontWeight: '700',
    marginBottom: 8,
  },
  predictionValue: {
    color: theme.textoPrincipal,
    fontSize: Math.round(42 * fontScale),
    fontWeight: '900',
    lineHeight: Math.round(48 * fontScale),
  },
  confidenceValue: {
    color: theme.textoPrincipal,
    fontSize: Math.round(26 * fontScale),
    fontWeight: '800',
    lineHeight: Math.round(34 * fontScale),
  },
  feedbackText: {
    color: theme.textoSecundario,
    fontSize: Math.round(14 * fontScale),
    lineHeight: Math.round(20 * fontScale),
    marginTop: 14,
  },
  feedbackError: {
    color: theme.erro,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: theme.superficie,
    borderColor: theme.inputBorda,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    shadowColor: theme.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: theme.fundoIcone,
    borderRadius: 18,
    height: 64,
    justifyContent: 'center',
    marginBottom: 18,
    width: 64,
  },
  emptyIconText: {
    color: theme.iconeTeal,
    fontSize: Math.round(13 * fontScale),
    fontWeight: '900',
  },
  emptyTitle: {
    color: theme.textoPrincipal,
    fontSize: Math.round(20 * fontScale),
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyCopy: {
    color: theme.textoSecundario,
    fontSize: Math.round(14 * fontScale),
    lineHeight: Math.round(21 * fontScale),
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.destaque,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 50,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: Math.round(16 * fontScale),
    fontWeight: '700',
  },
});
