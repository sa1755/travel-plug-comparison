import { ImageResponse } from "next/og";

export const alt = "TravelPlug — clear international plug and power guidance";
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
          position: "relative",
          overflow: "hidden",
          background: "#F8FAFD",
          color: "#162033",
          fontFamily: "sans-serif",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            right: -120,
            top: -170,
            borderRadius: 999,
            background: "#E8F0FE",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 330,
            height: 330,
            right: 70,
            bottom: -190,
            borderRadius: 999,
            background: "#1A73E8",
            opacity: 0.12,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
            <div style={{ width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 17, background: "#1A73E8", color: "white" }}>T</div>
            TravelPlug
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 850 }}>
            <div style={{ color: "#174EA6", fontSize: 23, fontWeight: 700, letterSpacing: 2 }}>TRAVEL POWER, EXPLAINED SIMPLY</div>
            <div style={{ marginTop: 18, fontSize: 66, lineHeight: 1.08, fontWeight: 800, letterSpacing: -2.5 }}>Know what plug you need before you fly.</div>
            <div style={{ marginTop: 24, color: "#5F6B7A", fontSize: 28, lineHeight: 1.35 }}>Compare sockets, voltage, frequency, and device guidance between countries.</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
