import Link from "next/link";

type ServerAction = (formData: FormData) => void | Promise<void>;

type ContentStatus = "draft" | "published" | "archived";

/**
 * Boton ★ Destacar/Destacado para las tablas. Misma Server Action por entidad.
 */
export function FeaturedToggle({
  id,
  isFeatured,
  action,
}: {
  id: string;
  isFeatured: boolean;
  action: ServerAction;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="featured" value={String(isFeatured)} />
      <button
        type="submit"
        className={`text-xs font-medium transition hover:text-fuchsia ${
          isFeatured ? "text-fuchsia" : "text-muted"
        }`}
      >
        {isFeatured ? "★ Destacado" : "☆ Destacar"}
      </button>
    </form>
  );
}

/**
 * Celda de acciones (Editar / Publicar-Despublicar / Borrar) compartida por las
 * tablas de Proyectos y Albumes. Las Server Actions se pasan por props.
 */
export function RowActions({
  editHref,
  id,
  status,
  publishedAction,
  deleteAction,
}: {
  editHref: string;
  id: string;
  status: ContentStatus;
  publishedAction: ServerAction;
  deleteAction: ServerAction;
}) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      <Link href={editHref} className="text-cyan transition hover:brightness-110">
        Editar
      </Link>
      <form action={publishedAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={status} />
        <button type="submit" className="text-amber transition hover:brightness-110">
          {status === "published" ? "Despublicar" : "Publicar"}
        </button>
      </form>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-muted transition hover:text-fuchsia"
        >
          Borrar
        </button>
      </form>
    </div>
  );
}
