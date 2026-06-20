type StatusBadgeProps = {
  variant: "published" | "draft" | "archived" | "featured";
  children: React.ReactNode;
};

const variants: Record<StatusBadgeProps["variant"], string> = {
  // Design system (fase-6): published -> cyan, draft -> amber,
  // archived -> muted, featured -> fucsia.
  published: "border-cyan/40 text-cyan",
  draft: "border-amber/40 text-amber",
  archived: "border-white/15 text-muted",
  featured: "border-fuchsia/40 text-fuchsia",
};

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
