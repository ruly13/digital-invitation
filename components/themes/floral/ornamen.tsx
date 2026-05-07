// components/FloralOrnament.tsx
// Original SVG ornament — NOT copied from Wekita

type FloralCornerProps = {
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
  opacity?: number;
  color?: "rose" | "green" | "cream";
};

export function FloralCorner({
  position,
  size = 160,
  opacity = 0.75,
}: FloralCornerProps) {
  const transforms: Record<string, string> = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: position.startsWith("b") ? "auto" : 0,
        bottom: position.startsWith("b") ? 0 : "auto",
        left: position.endsWith("l") ? 0 : "auto",
        right: position.endsWith("r") ? 0 : "auto",
        opacity,
        transformOrigin: position.endsWith("r")
          ? position.startsWith("b")
            ? "bottom right"
            : "top right"
          : position.startsWith("b")
          ? "bottom left"
          : "top left",
        transform: transforms[position],
        pointerEvents: "none",
      }}
    >
      {/* Main stem */}
      <path
        d="M10 150 C30 120 20 80 40 60 C55 45 70 50 80 30"
        stroke="#C4785A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Branch 1 */}
      <path
        d="M40 60 C50 45 65 40 75 20"
        stroke="#7A9E78"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      {/* Branch 2 */}
      <path
        d="M25 95 C35 80 50 75 65 60"
        stroke="#7A9E78"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Flower 1 — large */}
      <g transform="translate(40,58)">
        <ellipse cx="0" cy="-14" rx="7" ry="13" fill="#C4785A" opacity="0.35" transform="rotate(0)"/>
        <ellipse cx="10" cy="-10" rx="7" ry="13" fill="#C4785A" opacity="0.3" transform="rotate(50)"/>
        <ellipse cx="12" cy="2" rx="7" ry="13" fill="#F2D9CC" opacity="0.4" transform="rotate(110)"/>
        <ellipse cx="0" cy="10" rx="7" ry="13" fill="#C4785A" opacity="0.3" transform="rotate(170)"/>
        <ellipse cx="-12" cy="2" rx="7" ry="13" fill="#F2D9CC" opacity="0.35" transform="rotate(230)"/>
        <ellipse cx="-10" cy="-10" rx="7" ry="13" fill="#C4785A" opacity="0.3" transform="rotate(295)"/>
        <circle cx="0" cy="0" r="5" fill="#B8924A" opacity="0.6"/>
      </g>

      {/* Flower 2 — small */}
      <g transform="translate(76,28)">
        <ellipse cx="0" cy="-8" rx="5" ry="9" fill="#F2D9CC" opacity="0.5" transform="rotate(0)"/>
        <ellipse cx="7" cy="-4" rx="5" ry="9" fill="#C4785A" opacity="0.4" transform="rotate(60)"/>
        <ellipse cx="7" cy="4" rx="5" ry="9" fill="#F2D9CC" opacity="0.45" transform="rotate(120)"/>
        <ellipse cx="0" cy="8" rx="5" ry="9" fill="#C4785A" opacity="0.4" transform="rotate(180)"/>
        <ellipse cx="-7" cy="4" rx="5" ry="9" fill="#F2D9CC" opacity="0.4" transform="rotate(240)"/>
        <ellipse cx="-7" cy="-4" rx="5" ry="9" fill="#C4785A" opacity="0.35" transform="rotate(300)"/>
        <circle cx="0" cy="0" r="3.5" fill="#B8924A" opacity="0.55"/>
      </g>

      {/* Flower 3 — tiny */}
      <g transform="translate(65,58)">
        <ellipse cx="0" cy="-6" rx="4" ry="7" fill="#C4785A" opacity="0.35" transform="rotate(0)"/>
        <ellipse cx="5" cy="-3" rx="4" ry="7" fill="#7A9E78" opacity="0.3" transform="rotate(72)"/>
        <ellipse cx="4" cy="4" rx="4" ry="7" fill="#C4785A" opacity="0.3" transform="rotate(144)"/>
        <ellipse cx="-4" cy="4" rx="4" ry="7" fill="#7A9E78" opacity="0.3" transform="rotate(216)"/>
        <ellipse cx="-5" cy="-3" rx="4" ry="7" fill="#C4785A" opacity="0.3" transform="rotate(288)"/>
        <circle cx="0" cy="0" r="2.5" fill="#B8924A" opacity="0.5"/>
      </g>

      {/* Leaves */}
      <ellipse cx="25" cy="95" rx="9" ry="16" fill="#7A9E78" opacity="0.3" transform="rotate(-30 25 95)"/>
      <ellipse cx="55" cy="75" rx="7" ry="13" fill="#5C7A5A" opacity="0.25" transform="rotate(20 55 75)"/>
      <ellipse cx="15" cy="120" rx="6" ry="11" fill="#7A9E78" opacity="0.25" transform="rotate(-15 15 120)"/>
      <ellipse cx="50" cy="45" rx="5" ry="10" fill="#7A9E78" opacity="0.3" transform="rotate(35 50 45)"/>

      {/* Tiny dots / buds */}
      <circle cx="30" cy="70" r="2.5" fill="#C4785A" opacity="0.45"/>
      <circle cx="60" cy="40" r="2" fill="#B8924A" opacity="0.4"/>
      <circle cx="18" cy="108" r="2" fill="#7A9E78" opacity="0.4"/>
      <circle cx="70" cy="50" r="1.5" fill="#C4785A" opacity="0.35"/>
      <circle cx="45" cy="30" r="1.5" fill="#7A9E78" opacity="0.35"/>

      {/* Small sprigs */}
      <path d="M55 75 C60 68 68 65 72 58" stroke="#7A9E78" strokeWidth="0.6" fill="none" opacity="0.35"/>
      <path d="M15 120 C20 110 28 105 35 95" stroke="#7A9E78" strokeWidth="0.6" fill="none" opacity="0.3"/>
    </svg>
  );
}

// Thin decorative divider between sections
export function FloralDivider({ color = "#C4785A" }: { color?: string }) {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "0.5rem 0" }}>
      <svg width="220" height="28" viewBox="0 0 220 28" fill="none">
        <line x1="0" y1="14" x2="85" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3"/>
        <path d="M90 14 C95 8 100 4 110 4 C120 4 125 8 130 14 C125 20 120 24 110 24 C100 24 95 20 90 14Z" fill={color} opacity="0.25"/>
        <circle cx="110" cy="14" r="3" fill={color} opacity="0.5"/>
        <circle cx="98" cy="14" r="1.5" fill={color} opacity="0.35"/>
        <circle cx="122" cy="14" r="1.5" fill={color} opacity="0.35"/>
        <line x1="135" y1="14" x2="220" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3"/>
        {/* tiny leaves on line */}
        <ellipse cx="60" cy="12" rx="4" ry="2" fill="#7A9E78" opacity="0.3" transform="rotate(-15 60 12)"/>
        <ellipse cx="160" cy="16" rx="4" ry="2" fill="#7A9E78" opacity="0.3" transform="rotate(15 160 16)"/>
        <circle cx="40" cy="14" r="1.5" fill={color} opacity="0.25"/>
        <circle cx="180" cy="14" r="1.5" fill={color} opacity="0.25"/>
      </svg>
    </div>
  );
}

// Small inline ornament above section titles
export function SectionOrnament() {
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none" style={{ marginBottom: "0.5rem" }}>
      <line x1="0" y1="12" x2="30" y2="12" stroke="#C4785A" strokeWidth="0.5" opacity="0.4"/>
      <path d="M32 12 C34 8 37 6 40 6 C43 6 46 8 48 12 C46 16 43 18 40 18 C37 18 34 16 32 12Z" fill="#C4785A" opacity="0.3"/>
      <circle cx="40" cy="12" r="2" fill="#C4785A" opacity="0.5"/>
      <line x1="50" y1="12" x2="80" y2="12" stroke="#C4785A" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

// Bismillah ornament
export function BismillahOrnament() {
  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
        <path d="M10 20 C30 10 50 5 100 5 C150 5 170 10 190 20" stroke="#C4785A" strokeWidth="0.8" opacity="0.3" fill="none"/>
        <path d="M10 20 C30 30 50 35 100 35 C150 35 170 30 190 20" stroke="#C4785A" strokeWidth="0.8" opacity="0.3" fill="none"/>
        <ellipse cx="100" cy="20" rx="12" ry="8" fill="#C4785A" opacity="0.15"/>
        <circle cx="100" cy="20" r="4" fill="#C4785A" opacity="0.35"/>
        <circle cx="75" cy="20" r="2" fill="#7A9E78" opacity="0.35"/>
        <circle cx="125" cy="20" r="2" fill="#7A9E78" opacity="0.35"/>
        <circle cx="55" cy="18" r="1.5" fill="#C4785A" opacity="0.3"/>
        <circle cx="145" cy="18" r="1.5" fill="#C4785A" opacity="0.3"/>
      </svg>
    </div>
  );
}