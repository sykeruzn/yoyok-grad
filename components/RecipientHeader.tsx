import { Avatar } from "./Avatar";

export function RecipientHeader({
  name,
  color,
  icon,
  firstMetYear,
  collegeYear,
}: {
  name: string;
  color: string;
  icon?: string | null;
  firstMetYear?: number | null;
  collegeYear?: string | null;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 animate-petal-in">
      <Avatar name={name} color={color} icon={icon} size={96} />
      <h1 className="font-display text-4xl sm:text-5xl leading-tight text-ink">
        {name}
      </h1>

      {(firstMetYear || collegeYear) && (
        <div>
          <p className="font-display text-sm text-magenta tracking-wide">
            The Year We Met
          </p>
          <p className="text-ink/70 text-sm mt-0.5">
            {[firstMetYear, collegeYear].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
