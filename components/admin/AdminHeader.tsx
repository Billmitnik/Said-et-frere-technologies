import { logoutAction } from "@/app/admin/actions";
import { Brand } from "@/components/site/Brand";

type AdminHeaderProps = {
  signedIn?: boolean;
};

export function AdminHeader({ signedIn = true }: AdminHeaderProps) {
  return (
    <header className="site-header admin-header">
      <div className="header-main">
        <div className="admin-brand">
          <Brand href="/admin" label="Administration SAID & FRÈRES TECHNOLOGIES" />
          <span className="admin-tag">Administration</span>
        </div>
        <nav className="admin-nav" aria-label="Administration">
          <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>
          {signedIn && (
            <form action={logoutAction}>
              <button type="submit">Se déconnecter</button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
