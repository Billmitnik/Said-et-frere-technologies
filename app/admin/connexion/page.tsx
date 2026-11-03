import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminConfigured, isAdminSession } from "@/lib/server/admin/auth";

export const metadata: Metadata = { title: "Connexion" };

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin");

  return (
    <>
      <AdminHeader signedIn={false} />
      <main className="admin-main admin-main-narrow">
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <div className="admin-card">
            <h1>Administration non configurée</h1>
            <p>Le mot de passe et l’accès à la base de données de l’administration ne sont pas encore installés sur ce site.</p>
          </div>
        )}
      </main>
    </>
  );
}
