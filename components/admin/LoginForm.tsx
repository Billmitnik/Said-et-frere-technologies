"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);

  return (
    <form className="admin-card admin-login" action={formAction}>
      <h1>Connexion</h1>
      <p>Espace réservé à l’équipe SAID &amp; FRÈRES TECHNOLOGIES.</p>
      <label htmlFor="admin-password">Mot de passe</label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" maxLength={200} required autoFocus />
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Vérification…" : "Se connecter"} <span aria-hidden="true">→</span>
      </button>
      <p className="admin-error" role="alert">{state?.error}</p>
    </form>
  );
}
