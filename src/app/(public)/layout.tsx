/// <reference types="react/canary" />
import { ViewTransition } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      <div className="flex flex-1 flex-col">
        <ViewTransition>{children}</ViewTransition>
      </div>
      <PublicFooter />
    </>
  );
}
