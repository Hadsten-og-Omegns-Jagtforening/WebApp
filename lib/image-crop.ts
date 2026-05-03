export type CropSourceInput = {
  imageWidth: number
  imageHeight: number
  zoom: number
  offsetX: number
  offsetY: number
}

export type CropSourceRect = {
  sx: number
  sy: number
  sw: number
  sh: number
}

const TARGET_RATIO = 3 / 2

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function calculateCropSourceRect({
  imageWidth,
  imageHeight,
  zoom,
  offsetX,
  offsetY,
}: CropSourceInput): CropSourceRect {
  const safeZoom = Math.max(1, zoom)
  let sw = imageWidth / safeZoom
  let sh = sw / TARGET_RATIO

  if (sh > imageHeight / safeZoom) {
    sh = imageHeight / safeZoom
    sw = sh * TARGET_RATIO
  }

  const centerX = imageWidth / 2 + offsetX * imageWidth
  const centerY = imageHeight / 2 + offsetY * imageHeight
  const sx = clamp(centerX - sw / 2, 0, imageWidth - sw)
  const sy = clamp(centerY - sh / 2, 0, imageHeight - sh)

  return {
    sx: Math.round(sx),
    sy: Math.round(sy),
    sw: Math.round(sw),
    sh: Math.round(sh),
  }
}
