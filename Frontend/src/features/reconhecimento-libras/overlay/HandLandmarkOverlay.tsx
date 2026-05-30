import Svg, { Circle, Line } from 'react-native-svg';
import type { HandDetectionResult } from '../hand-landmarks';
import { HAND_CONNECTIONS } from '../hand-landmarks';
import { mapLandmarksToPreview, type PreviewSize } from './mapLandmarksToPreview';

type HandLandmarkOverlayProps = {
  connectionColor?: string;
  detection: HandDetectionResult | null;
  landmarkColor?: string;
  mirrored?: boolean;
  previewSize: PreviewSize;
  wristColor?: string;
};

export const HandLandmarkOverlay = ({
  connectionColor = '#5BA4A4',
  detection,
  landmarkColor = '#ffffff',
  mirrored = false,
  previewSize,
  wristColor = '#FBBF24',
}: HandLandmarkOverlayProps) => {
  if (!detection) {
    return null;
  }

  const points = mapLandmarksToPreview(
    detection.landmarks,
    detection.frameSize,
    previewSize,
    { mirrored },
  );

  if (points.length === 0) {
    return null;
  }

  return (
    <Svg
      width={previewSize.width}
      height={previewSize.height}
      pointerEvents="none"
      style={{ position: 'absolute', inset: 0 }}
    >
      {HAND_CONNECTIONS.map(([from, to]) => {
        const start = points[from];
        const end = points[to];

        if (!start || !end) {
          return null;
        }

        return (
          <Line
            key={`${from}-${to}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={connectionColor}
            strokeLinecap="round"
            strokeWidth={4}
          />
        );
      })}
      {points.map((point, index) => (
        <Circle
          key={index}
          cx={point.x}
          cy={point.y}
          fill={index === 0 ? wristColor : landmarkColor}
          r={index === 0 ? 7 : 5}
          stroke="#1A1A2E"
          strokeWidth={2}
        />
      ))}
    </Svg>
  );
};
