"use client";

import { useEffect, useState } from "react";
import { Bell, Car, Check, FileText, Mail, Receipt, CalendarClock } from "lucide-react";
import { Hopper } from "./Hopper";
import { cn } from "@/lib/utils";
import { useAutoplay, useInView, usePrefersReducedMotion } from "@/hooks/use-autoplay";

type Agent = {
  key: string;
  name: string;
  icon: typeof Receipt;
  blurb: string;
  kind: string;
  title: string;
  sub: string;
  fields: [string, string][];
  primary: string;
  secondary: string;
  done: string;
};

const AGENTS: Agent[] = [
  {
    key: "receipts",
    name: "Receipts",
    icon: Receipt,
    blurb: "Snap or forward. Total, VAT and category read for you.",
    kind: "Receipt",
    title: "Screwfix",
    sub: "Trade counter · Bristol",
    fields: [
      ["Total", "£86.40"],
      ["VAT", "£14.40"],
      ["Category", "Materials"],
      ["Paid", "Card ••• 4417"],
    ],
    primary: "File in expenses",
    secondary: "Change category",
    done: "Filed in Expenses · Nov",
  },
  {
    key: "mileage",
    name: "Mileage",
    icon: Car,
    blurb: "Finds trips in your calendar and works out the business miles.",
    kind: "Trip",
    title: "Office → Client site, Bath",
    sub: "From your calendar · Thu 5 Nov",
    fields: [
      ["Distance", "24.6 mi return"],
      ["Rate", "45p / mile"],
      ["Claim", "£11.07"],
      ["Purpose", "Site visit · Jo's kitchen"],
    ],
    primary: "Log this trip",
    secondary: "Personal, skip",
    done: "Logged · 312 mi this month",
  },
  {
    key: "invoices",
    name: "Invoices",
    icon: FileText,
    blurb: "Finds overdue invoices and drafts a reminder for you to send.",
    kind: "Overdue",
    title: "INV-0142 · Jo's kitchen refit",
    sub: "Sent 12 Oct · 14 days late",
    fields: [
      ["Amount", "£1,250.00"],
      ["Due", "Mon 26 Oct"],
      ["Reminders", "None sent"],
      ["Contact", "Jo"],
    ],
    primary: "Send reminder",
    secondary: "Edit draft first",
    done: "Reminder sent to Jo",
  },
  {
    key: "inbox",
    name: "Inbox",
    icon: Mail,
    blurb: "Finds tasks and deadlines in your email.",
    kind: "From email",
    title: "Quote request: kitchen refit",
    sub: "Email · Priya",
    fields: [
      ["Asks for", "Quote by Friday"],
      ["Effort", "About 30 min"],
      ["Lane", "Deep focus"],
      ["Due", "Fri 13 Nov"],
    ],
    primary: "Add to Friday",
    secondary: "Not a task",
    done: "Added to Friday · Deep focus",
  },
  {
    key: "calendar",
    name: "Calendar",
    icon: CalendarClock,
    blurb: "Finds time for focused work and flags clashes between jobs.",
    kind: "Clash",
    title: "Supplier call vs. site visit",
    sub: "Calendar · Thu 12 Nov",
    fields: [
      ["Overlap", "10:00 – 10:30"],
      ["Suggest", "Move call to 14:00"],
      ["Both free", "14:00 – 15:00"],
      ["Notify", "Supplier by email"],
    ],
    primary: "Move the call",
    secondary: "Keep both",
    done: "Call moved to 14:00",
  },
];

export function AgentDesk() {
  const [active, setActive] = useState<string>("receipts");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const agent = AGENTS.find((a) => a.key === active)!;
  const pending = AGENTS.filter((a) => !approved[a.key]).length;
  const isDone = approved[agent.key];
  const [rootRef, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const { auto, interact } = useAutoplay();

  // Plays itself on a loop: shows each agent's card, approves it, moves to the next,
  // then clears the board and starts over. A visitor's click pauses it for a few seconds.
  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const index = AGENTS.findIndex((a) => a.key === active);
    const next = AGENTS[index + 1];
    let t: number;
    if (!approved[active]) {
      t = window.setTimeout(() => setApproved((s) => ({ ...s, [active]: true })), 2400);
    } else if (next) {
      t = window.setTimeout(() => setActive(next.key), 1500);
    } else {
      t = window.setTimeout(() => {
        setApproved({});
        setActive(AGENTS[0]?.key ?? "receipts");
      }, 3400);
    }
    return () => window.clearTimeout(t);
  }, [auto, inView, reduced, active, approved]);

  return (
    <div ref={rootRef} onPointerDownCapture={interact} onKeyDownCapture={interact} className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Agent list */}
      <div className="rounded-[1.25rem] border border-night-line bg-night p-5 text-night-foreground shadow-float">
        <p className="font-display text-3xl font-extrabold tracking-tight">Agents</p>
        <p className="mt-1 text-sm text-night-muted">
          Connect once. They work quietly and ask before anything important.
        </p>
        <div
          className={cn(
            "mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
            pending ? "border-primary/50 bg-token-date-bg/40" : "border-night-line bg-night-card",
          )}
        >
          <Bell className="h-4 w-4 text-primary" />
          <p className="flex-1 text-sm font-bold">
            {pending ? `${pending} things need your OK` : "All clear. Nothing waiting."}
          </p>
          {pending > 0 && (
            <span className="label-mono rounded-full bg-primary px-2.5 py-1 text-[10px] text-primary-foreground">
              Review
            </span>
          )}
        </div>
        <ul className="mt-4 divide-y divide-night-line overflow-hidden rounded-2xl bg-night-card">
          {AGENTS.map((a) => (
            <li key={a.key}>
              <button
                onClick={() => setActive(a.key)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-night-raised",
                  active === a.key && "bg-night-raised",
                )}
                aria-pressed={active === a.key}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-night text-primary">
                  <a.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-bold">
                    {a.name}
                    {approved[a.key] ? (
                      <Check className="h-3.5 w-3.5 text-token-phone" strokeWidth={3} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse-ore" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-night-muted">{a.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Agent result card */}
      <div className="flex flex-col justify-center">
        <div
          key={agent.key}
          className="animate-slide-in rounded-[1.25rem] bg-night p-6 text-night-foreground shadow-float"
        >
          <div className="flex gap-5">
            <div className="h-28 w-20 shrink-0 rounded-xl bg-cream-card p-3">
              <div className="h-1.5 w-10 rounded bg-paper-line" />
              <div className="mt-2 space-y-1.5">
                {[14, 12, 13, 9, 11].map((w, i) => (
                  <div key={i} className="h-1 rounded bg-paper-line" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
              <div className="mt-3 h-1.5 w-8 rounded bg-primary" />
            </div>
            <div className="min-w-0">
              <p className="label-mono flex items-center gap-2 text-primary">
                <Hopper tone="light" className="h-4 w-auto" /> {agent.kind}
              </p>
              <p className="mt-2 font-display text-2xl leading-tight font-bold">{agent.title}</p>
              <p className="label-mono mt-1 text-night-muted">{agent.sub}</p>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-night-line border-y border-night-line">
            {agent.fields.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-3">
                <dt className="label-mono text-night-muted">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {isDone ? (
            <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-night-card py-3 font-bold text-token-phone">
              <Check className="h-4 w-4" strokeWidth={3} /> {agent.done}
            </div>
          ) : (
            <div className="mt-5 grid gap-2">
              <button
                onClick={() => setApproved((s) => ({ ...s, [agent.key]: true }))}
                className="rounded-full bg-primary py-3 font-bold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {agent.primary}
              </button>
              <button className="rounded-full border border-night-line py-3 font-bold text-night-foreground hover:bg-night-card">
                {agent.secondary}
              </button>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          Hopper never files, sends or moves anything without a one-tap OK.
        </p>
      </div>
    </div>
  );
}
