export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold uppercase tracking-[0.28em] text-foreground">
            Luma Studio
          </p>
          <p className="mt-2 max-w-md">
            Archivo visual, fotografia, albumes y piezas audiovisuales.
          </p>
        </div>
        <div className="flex gap-4">
          <span>Instagram</span>
          <span>Vimeo</span>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
