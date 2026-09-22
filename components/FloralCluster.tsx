type FlowerProps = {
  cx: number;
  cy: number;
  size: number;
  color: string;
  center?: string;
  rotate?: number;
};

function Flower({ cx, cy, size, color, center = "#F0BD4C", rotate = 0 }: FlowerProps) {
  const petals = Array.from({ length: 6 });
  const r = size * 0.34;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      {petals.map((_, i) => {
        const angle = (i * 360) / petals.length;
        const rad = (angle * Math.PI) / 180;
        const px = Math.cos(rad) * r;
        const py = Math.sin(rad) * r;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={size * 0.24}
            ry={size * 0.34}
            fill={color}
            opacity={0.92}
            transform={`rotate(${angle} ${px} ${py})`}
          />
        );
      })}
      <circle r={size * 0.22} fill={center} />
    </g>
  );
}

function Leaf({
  x,
  y,
  length,
  color,
  rotate = 0,
}: {
  x: number;
  y: number;
  length: number;
  color: string;
  rotate?: number;
}) {
  return (
    <path
      d={`M${x} ${y} C ${x + length * 0.15} ${y - length * 0.6}, ${x + length * 0.85} ${
        y - length * 0.6
      }, ${x + length} ${y} C ${x + length * 0.85} ${y + length * 0.25}, ${
        x + length * 0.15
      } ${y + length * 0.25}, ${x} ${y}Z`}
      fill={color}
      opacity={0.55}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  );
}

function Sparkle({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <path
      d={`M${x} ${y - size} L${x + size * 0.22} ${y - size * 0.22} L${x + size} ${y} L${
        x + size * 0.22
      } ${y + size * 0.22} L${x} ${y + size} L${x - size * 0.22} ${y + size * 0.22} L${
        x - size
      } ${y} L${x - size * 0.22} ${y - size * 0.22}Z`}
      fill={color}
      opacity={0.85}
    />
  );
}

const PALETTE = {
  magenta: "#C3185B",
  marigold: "#E2892B",
  gold: "#F0BD4C",
  olive: "#78873A",
  orchid: "#8E44AD",
  turquoise: "#2AA9A0",
};

const PRESETS: Record<
  "topLeft" | "topRight" | "bottomLeft" | "bottomRight",
  { flowers: FlowerProps[]; leaves: { x: number; y: number; length: number; color: string; rotate?: number }[]; sparkles: { x: number; y: number; size: number; color: string }[] }
> = {
  topLeft: {
    flowers: [
      { cx: 28, cy: 30, size: 26, color: PALETTE.magenta },
      { cx: 62, cy: 14, size: 16, color: PALETTE.turquoise, rotate: 20 },
      { cx: 14, cy: 66, size: 13, color: PALETTE.orchid, rotate: 10 },
    ],
    leaves: [
      { x: 6, y: 8, length: 60, color: PALETTE.olive, rotate: -18 },
      { x: 30, y: 60, length: 34, color: PALETTE.olive, rotate: 40 },
    ],
    sparkles: [
      { x: 84, y: 40, size: 5, color: PALETTE.gold },
      { x: 44, y: 78, size: 4, color: PALETTE.marigold },
    ],
  },
  topRight: {
    flowers: [
      { cx: 96, cy: 26, size: 22, color: PALETTE.orchid },
      { cx: 60, cy: 14, size: 14, color: PALETTE.gold, rotate: -15 },
      { cx: 108, cy: 62, size: 16, color: PALETTE.marigold, rotate: 25 },
    ],
    leaves: [
      { x: 118, y: 10, length: 55, color: PALETTE.olive, rotate: 200 },
      { x: 76, y: 56, length: 30, color: PALETTE.olive, rotate: 140 },
    ],
    sparkles: [
      { x: 42, y: 46, size: 4, color: PALETTE.magenta },
      { x: 90, y: 84, size: 5, color: PALETTE.turquoise },
    ],
  },
  bottomLeft: {
    flowers: [
      { cx: 24, cy: 96, size: 24, color: PALETTE.turquoise },
      { cx: 60, cy: 108, size: 14, color: PALETTE.magenta, rotate: 12 },
      { cx: 12, cy: 56, size: 13, color: PALETTE.gold, rotate: -10 },
    ],
    leaves: [
      { x: 4, y: 118, length: 58, color: PALETTE.olive, rotate: -70 },
      { x: 40, y: 70, length: 30, color: PALETTE.olive, rotate: -10 },
    ],
    sparkles: [
      { x: 82, y: 90, size: 5, color: PALETTE.marigold },
      { x: 50, y: 40, size: 4, color: PALETTE.orchid },
    ],
  },
  bottomRight: {
    flowers: [
      { cx: 100, cy: 100, size: 25, color: PALETTE.marigold },
      { cx: 62, cy: 112, size: 15, color: PALETTE.orchid, rotate: 8 },
      { cx: 112, cy: 60, size: 14, color: PALETTE.magenta, rotate: -12 },
    ],
    leaves: [
      { x: 122, y: 122, length: 56, color: PALETTE.olive, rotate: 110 },
      { x: 78, y: 78, length: 28, color: PALETTE.olive, rotate: 200 },
    ],
    sparkles: [
      { x: 38, y: 92, size: 4, color: PALETTE.turquoise },
      { x: 88, y: 34, size: 5, color: PALETTE.gold },
    ],
  },
};

export function FloralCluster({
  corner,
  className = "",
}: {
  corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  className?: string;
}) {
  const preset = PRESETS[corner];
  return (
    <svg
      viewBox="0 0 130 130"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {preset.leaves.map((leaf, i) => (
        <Leaf key={`leaf-${i}`} {...leaf} />
      ))}
      {preset.flowers.map((flower, i) => (
        <Flower key={`flower-${i}`} {...flower} />
      ))}
      {preset.sparkles.map((s, i) => (
        <Sparkle key={`sparkle-${i}`} {...s} />
      ))}
    </svg>
  );
}

export function FloralCorners({ variant = "cream" }: { variant?: "cream" | "teal" }) {
  const opacity = variant === "teal" ? "opacity-80" : "opacity-90";
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0" aria-hidden="true">
      <FloralCluster
        corner="topLeft"
        className={`absolute -top-4 -left-4 w-28 h-28 sm:w-36 sm:h-36 ${opacity}`}
      />
      <FloralCluster
        corner="topRight"
        className={`absolute -top-4 -right-4 w-28 h-28 sm:w-36 sm:h-36 ${opacity}`}
      />
      <FloralCluster
        corner="bottomLeft"
        className={`absolute -bottom-4 -left-4 w-28 h-28 sm:w-36 sm:h-36 ${opacity}`}
      />
      <FloralCluster
        corner="bottomRight"
        className={`absolute -bottom-4 -right-4 w-28 h-28 sm:w-36 sm:h-36 ${opacity}`}
      />
    </div>
  );
}
