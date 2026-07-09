export function FloatingBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob" style={{ background: "#E7E4FF", width: 620, height: 620, top: -140, left: -120 }} />
      <div className="blob" style={{ background: "#DFF7EE", width: 520, height: 520, top: 260, right: -160 }} />
      <div className="blob" style={{ background: "#E5F1FF", width: 480, height: 480, top: 720, left: 40 }} />
      <div className="blob" style={{ background: "#FFF7E9", width: 560, height: 700, top: 1800, right: -80 }} />
      <div className="blob" style={{ background: "#E7E4FF", width: 500, height: 650, top: 1900, left: -100, opacity: 0.7 }} />
      <div className="blob" style={{ background: "#DFF7EE", width: 620, height: 620, top: 2600, right: -140, opacity: 0.7 }} />
    </div>
  );
}

export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
}
