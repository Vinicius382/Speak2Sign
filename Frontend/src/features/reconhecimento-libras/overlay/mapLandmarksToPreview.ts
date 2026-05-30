import type { FrameSize, HandLandmark } from '../hand-landmarks';

export type PreviewSize = {
  width: number;
  height: number;
};

export type PreviewPoint = {
  x: number;
  y: number;
  z: number;
};

type MapLandmarksToPreviewOptions = {
  mirrored?: boolean;
};

export const mapLandmarksToPreview = (
  landmarks: HandLandmark[],
  frameSize: FrameSize,
  previewSize: PreviewSize,
  options: MapLandmarksToPreviewOptions = {},
): PreviewPoint[] => {
  if (
    frameSize.width <= 0 ||
    frameSize.height <= 0 ||
    previewSize.width <= 0 ||
    previewSize.height <= 0
  ) {
    return [];
  }

  const scale = Math.max(
    previewSize.width / frameSize.width,
    previewSize.height / frameSize.height,
  );
  const displayedWidth = frameSize.width * scale;
  const displayedHeight = frameSize.height * scale;
  const offsetX = (previewSize.width - displayedWidth) / 2;
  const offsetY = (previewSize.height - displayedHeight) / 2;

  return landmarks.map((landmark) => {
    const mappedX = offsetX + landmark.x * frameSize.width * scale;

    return {
      x: options.mirrored ? previewSize.width - mappedX : mappedX,
      y: offsetY + landmark.y * frameSize.height * scale,
      z: landmark.z,
    };
  });
};
