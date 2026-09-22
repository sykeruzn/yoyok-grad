export function Avatar({
  name,
  color,
  icon,
  size = 88,
}: {
  name: string;
  color: string;
  icon?: string | null;
  size?: number;
}) {
  const initial = (icon || name || "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}22`,
        border: `2px solid ${color}`,
      }}
    >
      <span
        className="font-display font-medium leading-none"
        style={{ fontSize: size * 0.4, color }}
      >
        {initial}
      </span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="absolute -right-1 -top-1"
        style={{ width: size * 0.32, height: size * 0.32 }}
      >
        <circle cx="12" cy="12" r="3.4" fill="#F0BD4C" />
        <circle cx="6" cy="9" r="2.2" fill={color} opacity="0.75" />
        <circle cx="18" cy="9" r="2.2" fill={color} opacity="0.75" />
        <circle cx="8.5" cy="17" r="2.2" fill={color} opacity="0.6" />
        <circle cx="15.5" cy="17" r="2.2" fill={color} opacity="0.6" />
      </svg>
    </div>
  );
}
