import { getAvatarColor, getInitials } from "@/utils/avatar";

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Avatar({
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const dimensions = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <span
      title={name}
      aria-label={name}
      role="img"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ${dimensions} ${getAvatarColor(
        name
      )} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
