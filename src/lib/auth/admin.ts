import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/session";

export async function getAdminSession() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!sessionSecret || !adminEmail) {
    return null;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await verifyAdminSessionToken(sessionToken, sessionSecret);

  if (!session || session.email.trim().toLowerCase() !== adminEmail) {
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
