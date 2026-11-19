import { cn } from "@/lib/utils";

// Real files in /public (not Lovable asset pointers) so the mascot always loads on the deployed site.
// on-light = dark cart for pale backgrounds; on-dark = white cart for night backgrounds.
const SRC = { dark: "/hopper-on-light.svg", light: "/hopper-on-dark.svg" } as const;
// Faceless version (no eyes or smile) for use beside the MY ORE wordmark.
const BLANK = { dark: "/hopper-blank-on-light.svg", light: "/hopper-blank-on-dark.svg" } as const;

/** Hopper, the My Ore mascot. `tone="dark"` = black cart for light backgrounds. */
export function Hopper({
  tone = "dark",
  blank = false,
  className,
  alt = "",
}: {
  tone?: "dark" | "light";
  blank?: boolean;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={(blank ? BLANK : SRC)[tone]}
      alt={alt}
      draggable={false}
      className={cn("select-none", className)}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Hopper blank className="h-9 w-auto shrink-0" alt="" />
      <span className="font-display text-lg font-bold tracking-[0.2em]">MY ORE</span>
    </span>
  );
}
