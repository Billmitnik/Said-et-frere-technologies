import { ImageResponse } from "next/og";

// Preview card shown when the site link is shared (WhatsApp, Facebook…).
// Product pages use their own product photo instead.
export const alt = "SAID & FRÈRES TECHNOLOGIES — matériel informatique et maintenance à Bouaké";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          color: "white",
          background: "#111827",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 22,
              background: "#1d2a3e",
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            S<span style={{ color: "#4056b7", fontSize: 30 }}>+</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: 1 }}>SAID &amp; FRÈRES</span>
            <span style={{ fontSize: 22, color: "#a7b0c1", letterSpacing: 8 }}>TECHNOLOGIES</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>La tech qu’il vous faut.</span>
          <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, color: "#6f83e0" }}>À Bouaké.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#c1ccdf" }}>
          Ordinateurs · Accessoires · Maintenance · Centre commercial Capitole
        </div>
      </div>
    ),
    size,
  );
}
