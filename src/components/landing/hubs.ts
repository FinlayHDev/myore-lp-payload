import { Briefcase, Home, User } from "lucide-react";

export type Hub = "My hub" | "Home" | "Work";

/**
 * Each hub has its own colour. These are written out in full so Tailwind can see them.
 * `border` and `bar` colour the task card and the progress bar once a hub is chosen.
 */
export const HUBS: Record<
  Hub,
  { icon: typeof User; text: string; border: string; bar: string; button: string }
> = {
  "My hub": {
    icon: User,
    text: "text-primary",
    border: "border-primary",
    bar: "bg-primary",
    button: "border-primary/50 bg-primary/10 text-primary",
  },
  Home: {
    icon: Home,
    text: "text-token-time",
    border: "border-token-time",
    bar: "bg-token-time",
    button: "border-token-time/50 bg-token-time-bg text-token-time",
  },
  Work: {
    icon: Briefcase,
    text: "text-token-action",
    border: "border-token-action",
    bar: "bg-token-action",
    button: "border-token-action/50 bg-token-action-bg text-token-action",
  },
};

export const HUB_ORDER: Hub[] = ["My hub", "Home", "Work"];

/** Look up a hub by name. Returns undefined for "Later" or "Deleted". */
export function hubOf(name: string | null | undefined) {
  return name && name in HUBS ? HUBS[name as Hub] : undefined;
}
