"use server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
} from "@/lib/auth/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function constantTimeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |=
      (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

function normalizeNext(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "/admin";
  }

  if (
    !value.startsWith("/admin") ||
    value.startsWith("/admin/login") ||
    value.startsWith("/admin/sign-up")
  ) {
    return "/admin";
  }

  return value;
}

function redirectToLogin(error: "config" | "invalid", nextPath: string): never {
  const params = new URLSearchParams({ error, next: nextPath });

  redirect(`/admin/login?${params.toString()}`);
}

export async function loginAction(formData: FormData) {
  const nextPath = normalizeNext(formData.get("next"));
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";

  if (!adminEmail || !adminPassword || !sessionSecret) {
    redirectToLogin("config", nextPath);
  }

  const validAdminEmail = adminEmail;
  const validSessionSecret = sessionSecret;

  if (
    email !== validAdminEmail ||
    !constantTimeEqual(password, adminPassword)
  ) {
    redirectToLogin("invalid", nextPath);
  }

  const maxAge = getAdminSessionMaxAgeSeconds();
  const token = await createAdminSessionToken(
    validAdminEmail,
    validSessionSecret,
    maxAge,
  );
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(nextPath);
}
