import type { Metadata } from "next";

// No session check here: layouts do not re-run on navigation, so every admin page and
// Server Action calls requireAdmin() itself.
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration SAID & FRÈRES" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell">{children}</div>;
}
