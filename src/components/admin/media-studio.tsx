"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminMediaRow } from "@/lib/data/content";
import {
  defaultMediaEditSettings,
  normalizeMediaEditSettings,
  type CropAspect,
  type MediaEditSettings,
} from "@/types/media";

type MediaStudioProps = {
  media: AdminMediaRow[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

const fieldClass =
  "rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-cyan";

const aspectOptions: Array<{ value: CropAspect; label: string }> = [
  { value: "1:1", label: "1:1" },
  { value: "4:5", label: "4:5" },
  { value: "3:2", label: "3:2" },
  { value: "16:9", label: "16:9" },
];

const aspectSizes: Record<CropAspect, { width: number; height: number }> = {
  "1:1": { width: 1200, height: 1200 },
  "4:5": { width: 1200, height: 1500 },
  "3:2": { width: 1200, height: 800 },
  "16:9": { width: 1280, height: 720 },
};

export function MediaStudio({
  media,
  createAction,
  updateAction,
  deleteAction,
}: MediaStudioProps) {
  const createFormId = "media-create-form";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [settings, setSettings] = useState<MediaEditSettings>(
    defaultMediaEditSettings,
  );
  const [exportMessage, setExportMessage] = useState("");

  const canvasSize = aspectSizes[settings.cropAspect];
  const editSettingsValue = useMemo(() => JSON.stringify(settings), [settings]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const imageUrl = previewUrl || sourceUrl;
    if (!canvas || !imageUrl) {
      const context = canvas?.getContext("2d");
      context?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
      return;
    }

    const image = new window.Image();
    if (!imageUrl.startsWith("blob:") && !imageUrl.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#0b0a12";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`;

      const baseScale = Math.max(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      const scale = baseScale * settings.zoom;
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = (canvas.width - width) / 2 + (settings.offsetX / 100) * 420;
      const y = (canvas.height - height) / 2 + (settings.offsetY / 100) * 420;

      context.drawImage(image, x, y, width, height);
      context.filter = "none";

      const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.75,
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.24)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    image.onerror = () => {
      setExportMessage("No pude cargar esa imagen en el canvas.");
    };

    image.src = imageUrl;
  }, [canvasSize.height, canvasSize.width, previewUrl, settings, sourceUrl]);

  function updateSetting<Key extends keyof MediaEditSettings>(
    key: Key,
    value: MediaEditSettings[Key],
  ) {
    setSettings((current) =>
      normalizeMediaEditSettings({ ...current, [key]: value }),
    );
  }

  function selectAsset(item: AdminMediaRow) {
    setSelectedId(item.id);
    setSourceUrl(item.url);
    setPreviewUrl("");
    setAlt(item.alt);
    setCaption(item.caption);
    setSettings(normalizeMediaEditSettings(item.editSettings));
    setExportMessage("Imagen abierta en el studio.");
  }

  function handleLocalFile(file: File | undefined) {
    if (!file) {
      return;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    setSelectedId("");
    setExportMessage(
      "Archivo local cargado. Puedes exportarlo o agregar una URL para guardarlo.",
    );
  }

  function exportCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    try {
      const link = document.createElement("a");
      link.download = `luma-media-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setExportMessage("Exportacion lista como PNG.");
    } catch {
      setExportMessage(
        "El navegador bloqueo la exportacion por CORS. Usa archivo local o una URL con permisos.",
      );
    }
  }

  function resetStudio() {
    setSelectedId("");
    setSourceUrl("");
    setPreviewUrl("");
    setAlt("");
    setCaption("");
    setSettings(defaultMediaEditSettings);
    setExportMessage("");
  }

  return (
    <div className="mt-8 grid gap-8 2xl:grid-cols-[minmax(0,1.25fr)_420px]">
      <div className="grid gap-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
                Media Studio
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Preparar imagen</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Carga una imagen local para editar/exportar o usa una URL para
                guardarla en la biblioteca. Los ajustes quedan como metadata del
                asset.
              </p>
            </div>
            <button
              type="button"
              onClick={resetStudio}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:border-cyan hover:text-cyan"
            >
              Limpiar studio
            </button>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative rounded-lg border border-border/70 bg-background p-3">
              <canvas
                ref={canvasRef}
                className="aspect-[4/5] w-full rounded-md bg-surface-raised object-contain"
                style={{
                  aspectRatio: `${canvasSize.width} / ${canvasSize.height}`,
                }}
              />
              {!previewUrl && !sourceUrl ? (
                <div className="pointer-events-none absolute inset-3 grid place-items-center rounded-md border border-dashed border-border bg-surface-raised/70 p-6 text-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
                      Lienzo vacio
                    </p>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                      Carga una imagen local o abre un asset de la biblioteca
                      para ajustar encuadre, foco y color.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Archivo local
                <input
                  name="file"
                  form={createFormId}
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleLocalFile(event.target.files?.[0])}
                  className={fieldClass}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                URL para guardar
                <input
                  name="url"
                  type="url"
                  value={sourceUrl}
                  onChange={(event) => {
                    setSourceUrl(event.target.value);
                    setPreviewUrl("");
                    setSelectedId("");
                  }}
                  className={fieldClass}
                  placeholder="https://..."
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Texto alternativo
                <input
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Caption
                <input
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  className={fieldClass}
                />
              </label>

              <div className="grid gap-2 text-sm font-medium">
                Formato de recorte
                <div className="grid grid-cols-4 gap-2">
                  {aspectOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateSetting("cropAspect", option.value)}
                      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        settings.cropAspect === option.value
                          ? "border-cyan bg-cyan text-background"
                          : "border-border text-muted hover:border-cyan hover:text-cyan"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <RangeControl
                label="Zoom"
                min={0.6}
                max={2.6}
                step={0.05}
                value={settings.zoom}
                suffix="x"
                onChange={(value) => updateSetting("zoom", value)}
              />
              <RangeControl
                label="Mover horizontal"
                min={-100}
                max={100}
                value={settings.offsetX}
                suffix="%"
                onChange={(value) => updateSetting("offsetX", value)}
              />
              <RangeControl
                label="Mover vertical"
                min={-100}
                max={100}
                value={settings.offsetY}
                suffix="%"
                onChange={(value) => updateSetting("offsetY", value)}
              />
              <RangeControl
                label="Brillo"
                min={50}
                max={150}
                value={settings.brightness}
                suffix="%"
                onChange={(value) => updateSetting("brightness", value)}
              />
              <RangeControl
                label="Contraste"
                min={50}
                max={160}
                value={settings.contrast}
                suffix="%"
                onChange={(value) => updateSetting("contrast", value)}
              />
              <RangeControl
                label="Saturacion"
                min={0}
                max={180}
                value={settings.saturation}
                suffix="%"
                onChange={(value) => updateSetting("saturation", value)}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={exportCanvas}
              disabled={!previewUrl && !sourceUrl}
              className="rounded-md bg-cyan px-5 py-3 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Exportar PNG
            </button>

            <form id={createFormId} action={createAction}>
              <input type="hidden" name="url" value={sourceUrl} />
              <input type="hidden" name="alt" value={alt} />
              <input type="hidden" name="caption" value={caption} />
              <input type="hidden" name="width" value={canvasSize.width} />
              <input type="hidden" name="height" value={canvasSize.height} />
              <input
                type="hidden"
                name="editSettings"
                value={editSettingsValue}
              />
              <button
                type="submit"
                disabled={!sourceUrl && !previewUrl}
                className="rounded-md bg-fuchsia px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Guardar como nuevo asset
              </button>
            </form>

            <form action={updateAction}>
              <input type="hidden" name="id" value={selectedId} />
              <input
                type="hidden"
                name="editSettings"
                value={editSettingsValue}
              />
              <button
                type="submit"
                disabled={!selectedId}
                className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-muted transition hover:border-cyan hover:text-cyan disabled:cursor-not-allowed disabled:opacity-45"
              >
                Actualizar ajustes
              </button>
            </form>

            {exportMessage ? (
              <p className="text-sm text-muted">{exportMessage}</p>
            ) : null}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber">
                Biblioteca
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {media.length} imagenes
              </h2>
            </div>
            <p className="max-w-xl text-sm text-muted">
              Abre una imagen en el studio para reutilizar sus ajustes o borrala
              si ya no forma parte del archivo.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => (
              <figure
                key={item.id}
                className={`overflow-hidden rounded-lg border bg-surface transition ${
                  selectedId === item.id ? "border-cyan" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectAsset(item)}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-square bg-background">
                    {item.url ? (
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <figcaption className="p-3">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.caption || item.alt || "Sin titulo"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.width && item.height
                        ? `${item.width} x ${item.height}`
                        : "Sin dimensiones"}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
                      Abrir en studio
                    </p>
                  </figcaption>
                </button>
                <form
                  action={deleteAction}
                  className="border-t border-border p-3"
                >
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-muted transition hover:text-fuchsia"
                  >
                    Borrar
                  </button>
                </form>
              </figure>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-acid">
          Flujo recomendado
        </p>
        <ol className="mt-4 grid gap-4 text-sm leading-6 text-muted">
          <li>
            <span className="font-semibold text-foreground">1. Preparar:</span>{" "}
            carga archivo local o pega URL.
          </li>
          <li>
            <span className="font-semibold text-foreground">2. Ajustar:</span>{" "}
            define formato, foco, brillo, contraste y saturacion.
          </li>
          <li>
            <span className="font-semibold text-foreground">3. Exportar:</span>{" "}
            descarga PNG listo para subir al storage final.
          </li>
          <li>
            <span className="font-semibold text-foreground">4. Guardar:</span>{" "}
            registra la URL y conserva los ajustes editoriales del asset.
          </li>
        </ol>
        <div className="mt-5 rounded-md border border-amber/25 bg-amber/10 p-4 text-sm leading-6 text-muted">
          La subida directa a nube queda para la siguiente integracion. Este
          studio ya evita encerrar imagenes pesadas dentro de la base de datos.
        </div>
      </aside>
    </div>
  );
}

function RangeControl({
  label,
  min,
  max,
  step = 1,
  value,
  suffix,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span className="flex items-center justify-between gap-4">
        {label}
        <span className="font-mono text-xs text-muted">
          {Number.isInteger(value) ? value : value.toFixed(2)}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-cyan"
      />
    </label>
  );
}
