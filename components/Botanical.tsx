export function CornerSprig({
  className = "",
  color = "#78873A",
  accent = "#C3185B",
}: {
  className?: string;
  color?: string;
  accent?: string;
}) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 4C20 10 28 22 30 40C24 30 14 26 4 26"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M4 4C14 16 20 26 22 42"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="30" cy="12" r="5" fill={accent} opacity="0.85" />
      <circle cx="18" cy="30" r="3.5" fill="#F0BD4C" opacity="0.9" />
      <circle cx="9" cy="15" r="2.5" fill={color} opacity="0.7" />
      <path
        d="M12 8C15 10 16 13 15 17C12 15 10 12 12 8Z"
        fill={color}
        opacity="0.55"
      />
    </svg>
  );
}

export function WaveDivider({
  className = "",
  color = "#78873A",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 16"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 8C15 2 25 14 40 8C55 2 65 14 80 8C95 2 105 14 120 8C135 2 145 14 160 8C175 2 185 14 200 8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
