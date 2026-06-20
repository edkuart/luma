/// <reference types="react/canary" />
import { ViewTransition } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getSiteSettings } from "@/lib/data/content";
import { mergeTheme, themeToCssVariables } from "@/lib/theme";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const theme = mergeTheme(settings.theme);

  return (
    <div
      style={themeToCssVariables(theme)}
      className="flex min-h-full flex-1 flex-col bg-background text-foreground"
    >
      <PublicHeader />
      <div className="flex flex-1 flex-col">
        <ViewTransition>{children}</ViewTransition>
      </div>
      <PublicFooter />
    </div>
  );
}
