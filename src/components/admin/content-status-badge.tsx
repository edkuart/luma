import { StatusBadge } from "@/components/admin/status-badge";

type ContentStatus = "draft" | "published" | "archived";

const config: Record<
  ContentStatus,
  { variant: "published" | "draft" | "archived"; label: string }
> = {
  published: { variant: "published", label: "Publicado" },
  draft: { variant: "draft", label: "Borrador" },
  archived: { variant: "archived", label: "Archivado" },
};

/**
 * Badge de estado de un proyecto/album. Reemplaza el ternario
 * published/draft/archived que estaba repetido en cada lista y card.
 */
export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const { variant, label } = config[status];
  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}
