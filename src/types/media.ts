export type CropAspect = "1:1" | "4:5" | "3:2" | "16:9";

export type MediaEditSettings = {
  cropAspect: CropAspect;
  zoom: number;
  offsetX: number;
  offsetY: number;
  brightness: number;
  contrast: number;
  saturation: number;
};

export const defaultMediaEditSettings: MediaEditSettings = {
  cropAspect: "4:5",
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export function normalizeMediaEditSettings(
  settings?: Partial<MediaEditSettings> | null,
): MediaEditSettings {
  return {
    ...defaultMediaEditSettings,
    ...settings,
    cropAspect: settings?.cropAspect ?? defaultMediaEditSettings.cropAspect,
    zoom: clampNumber(settings?.zoom, 0.6, 2.6, defaultMediaEditSettings.zoom),
    offsetX: clampNumber(
      settings?.offsetX,
      -100,
      100,
      defaultMediaEditSettings.offsetX,
    ),
    offsetY: clampNumber(
      settings?.offsetY,
      -100,
      100,
      defaultMediaEditSettings.offsetY,
    ),
    brightness: clampNumber(
      settings?.brightness,
      50,
      150,
      defaultMediaEditSettings.brightness,
    ),
    contrast: clampNumber(
      settings?.contrast,
      50,
      160,
      defaultMediaEditSettings.contrast,
    ),
    saturation: clampNumber(
      settings?.saturation,
      0,
      180,
      defaultMediaEditSettings.saturation,
    ),
  };
}

function clampNumber(
  value: number | undefined,
  min: number,
  max: number,
  fallback: number,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, value));
}
