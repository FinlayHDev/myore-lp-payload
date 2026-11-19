"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Mic, Paperclip, Sparkles, Type } from "lucide-react";
import { Hopper } from "./Hopper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScratchpadSortFlow, type ScratchpadItem } from "./ScratchpadSortFlow";

type Kind = "date" | "action" | "phone" | "person" | "time";
type Seg = { t: string; k?: Kind };
type Note = {
  tag: "Us" | "Home" | "Work";
  segs: Seg[];
  chips: { label: string; k: Kind }[];
  tasks: { title: string; meta: string; when: string }[];
};

const NOTES: Note[] = [
  {
    tag: "Work",
    segs: [
      { t: "On " },
      { t: "Wednesday", k: "date" },
      { t: " I need to " },
      { t: "call", k: "action" },
      { t: " " },
      { t: "07700 900123", k: "phone" },
      { t: " about the van lease, and " },
      { t: "book", k: "action" },
      { t: " the MOT for " },
      { t: "Friday", k: "date" },
    ],
    chips: [
      { label: "Wed 11 Nov", k: "date" },
      { label: "Tap to call", k: "phone" },
      { label: "Fri 13 Nov", k: "date" },
    ],
    tasks: [
      { title: "Call about the van lease", meta: "Work · Quick win", when: "Wed" },
      { title: "Book the MOT", meta: "Work · 2 min", when: "Fri" },
    ],
  },
  {
    tag: "Work",
    segs: [
      { t: "remind me to " },
      { t: "email", k: "action" },
      { t: " " },
      { t: "Priya", k: "person" },
      { t: " back " },
      { t: "tomorrow", k: "date" },
      { t: " + send " },
      { t: "Harlow", k: "person" },
      { t: " the revised quote" },
    ],
    chips: [
      { label: "Tue 10 Nov", k: "date" },
      { label: "Priya", k: "person" },
      { label: "With others", k: "time" },
    ],
    tasks: [
      { title: "Email Priya back", meta: "Work · Quick win", when: "Tue" },
      { title: "Send Harlow the revised quote", meta: "Work · 15 min", when: "This week" },
    ],
  },
  {
    tag: "Work",
    segs: [
      { t: "finish", k: "action" },
      { t: " the tender response by " },
      { t: "Thursday 3pm", k: "date" },
      { t: ", needs about " },
      { t: "2 hrs", k: "time" },
      { t: " of quiet" },
    ],
    chips: [
      { label: "Thu 12 Nov · 15:00", k: "date" },
      { label: "Deep focus · 2h", k: "time" },
    ],
    tasks: [{ title: "Finish tender response", meta: "Work · Deep focus", when: "Thu" }],
  },
];

type Phase = "typing" | "read" | "sorting";

const tokenClass: Record<Kind, string> = {
  date: "token-date",
  action: "token-action",
  phone: "token-phone",
  person: "token-person",
  time: "token-time",
};

const chipClass: Record<Kind, string> = {
  date: "bg-token-date-bg text-token-date",
  action: "bg-token-action-bg text-token-action",
  phone: "bg-token-phone-bg text-token-phone",
  person: "bg-token-person-bg text-token-person",
  time: "bg-token-time-bg text-token-time",
};

export function ScratchpadDemo() {
  const [noteIndex, setNoteIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [reduced, setReduced] = useState(false);
  const [feed, setFeed] = useState<Note[]>([]);

  const note = NOTES[noteIndex];
  if (!note) throw new Error("Scratchpad demo note is missing");
  const total = useMemo(() => note.segs.reduce((n, s) => n + s.t.length, 0), [note]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (phase === "sorting") return;
    if (reduced && phase === "typing") {
      setChars(total);
      setPhase("read");
      return;
    }
    let t: number;
    if (phase === "typing") {
      if (chars < total) {
        t = window.setTimeout(() => setChars((c) => c + 1), 26 + Math.random() * 46);
      } else {
        t = window.setTimeout(() => setPhase("read"), 450);
      }
    } else {
      t = window.setTimeout(() => {
        if (noteIndex === NOTES.length - 1) {
          setPhase("sorting");
        } else {
          setFeed((current) => [...current, note]);
          setNoteIndex((current) => current + 1);
          setChars(0);
          setPhase("typing");
        }
      }, reduced ? 4000 : 1900);
    }
    return () => window.clearTimeout(t);
  }, [phase, chars, total, reduced, noteIndex, note]);

  const collected = [...feed, note];
  const sortingItems: ScratchpadItem[] = collected.flatMap((entry) => entry.tasks.map((task) => ({
    ...task,
    source: entry.segs.map((segment) => segment.t).join(""),
    destination: entry.tag === "Us" ? "My hub" as const : entry.tag,
  })));
  function restart() {
    setFeed([]);
    setNoteIndex(0);
    setChars(0);
    setPhase("typing");
  }
  function beginSort() {
    setChars(total);
    setPhase("sorting");
  }
  if (phase === "sorting") {
    return <div className="relative mx-auto w-full max-w-[420px]"><ScratchpadSortFlow items={sortingItems} onRestart={restart} /></div>;
  }

  const showChips = phase !== "typing";
  const toSort = sortingItems.length;

  let offset = 0;
  const rendered = note.segs.map((s, i) => {
    const visible = s.t.slice(0, Math.max(0, chars - offset));
    offset += s.t.length;
    if (!visible) return null;
    const complete = visible.length === s.t.length;
    if (s.k && complete) {
      return (
        <span key={i} className={cn("token", tokenClass[s.k])}>
          {visible}
        </span>
      );
    }
    return <span key={i}>{visible}</span>;
  });

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* Scratchpad box */}
      <div
        className="relative z-10 overflow-hidden rounded-[1.25rem] border border-night-line bg-night text-night-foreground shadow-float"
        aria-label="Animated demo: typing a note into the My Ore scratchpad"

      >
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-night-line bg-night-card">
            <Hopper
              tone="light"
              key={noteIndex}
              className="h-7 w-auto"
            />
            {toSort > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-night bg-primary" />
            )}
          </div>
          <div className="min-w-0 text-center">
            <p className="font-display text-[15px] font-bold">Monday 9 Nov</p>
            <p className="flex items-center justify-center gap-1.5 text-xs text-night-muted">
              {toSort} to sort <span className="h-1.5 w-1.5 rounded-full bg-primary" /> saved
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-night-line bg-night-card px-4 py-2 text-sm font-bold text-primary">
            Done
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 px-5">
          <span className="label-mono mr-1 text-night-muted">For</span>
          {(["Us", "Home", "Work"] as const).map((t) => (
            <span
              key={t}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-500",
                note.tag === t
                  ? "border-primary bg-token-date-bg/60 text-token-date"
                  : "border-night-line text-night-foreground",
              )}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Writing area */}
        <div className="relative h-[176px] px-5 pt-5">
          <p
            className={cn(
              "font-display text-[22px] leading-[1.55] font-medium tracking-tight transition-all duration-500",

            )}
          >
            {rendered}
            {phase === "typing" && (
              <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-primary" />
            )}
          </p>


        </div>

        <div className="min-h-[72px] px-5">
          <p
            className={cn(
              "label-mono flex items-center gap-1.5 text-night-muted transition-opacity duration-300",
              showChips ? "opacity-100" : "opacity-0",
            )}
          >
            <Sparkles className="h-3 w-3 text-primary" /> Hopper read this
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {showChips &&
              note.chips.map((c, i) => (
                <span
                  key={`${noteIndex}-${c.label}`}
                  className={cn(
                    "animate-slide-in rounded-full px-3 py-1.5 text-xs font-semibold",
                    chipClass[c.k],
                  )}
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  {c.label}
                </span>
              ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="m-4 mt-3 flex items-center gap-4 rounded-full border border-night-line bg-night-card py-2 pl-4 pr-2 text-night-muted">
          <CheckCircle2 className="h-4 w-4" />
          <Type className="h-4 w-4" />
          <Paperclip className="h-4 w-4" />
          <Mic className="h-4 w-4" />
          <Button
            onClick={beginSort}
            className={cn(
              "ml-auto h-auto rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
              toSort > 0
                ? "bg-primary text-primary-foreground"
                : "bg-night-raised text-night-muted",
              phase === "read" && "animate-pulse-ore",

            )}
          >
            {toSort > 0 ? `Sort ${toSort} item${toSort > 1 ? "s" : ""}` : "All sorted"}
          </Button>
        </div>
      </div>

      {/* Saved notes stay in the feed until Sort opens their extracted cards. */}
      <div className="relative z-20 -mt-2 min-h-[8.5rem] rounded-xl border border-night-line bg-night-card p-4 text-night-foreground">
        <div className="flex items-center justify-between gap-2">
          <p className="label-mono text-night-muted">Scratchpad feed</p>
          <p className="text-xs text-primary">{feed.length} saved</p>
        </div>
        <ul className="mt-3 space-y-2">
          {feed.length ? feed.slice(-2).map((entry, index) => (
            <li key={index} className="truncate border-t border-night-line pt-2 text-xs leading-relaxed">
              <span className="mr-2 font-bold text-primary">{entry.tag}</span>
              {entry.segs.map((segment) => segment.t).join("")}
            </li>
          )) : <li className="text-sm text-night-muted">Hopper is listening…</li>}
        </ul>
      </div>
    </div>
  );
}
