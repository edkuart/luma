import { redirect } from "next/navigation";

export const metadata = {
  title: "Crear cuenta admin",
};

export default function AdminSignUpPage() {
  redirect("/admin/login");
}
