"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Clock, RotateCcw } from "lucide-react";
import { Hopper } from "./Hopper";
import { cn } from "@/lib/utils";
import { useAutoplay, useInView, usePrefersReducedMotion } from "@/hooks/use-autoplay";

type Dir = "up" | "right" | "left" | "down";

const BUCKETS: Record<Dir, string> = {
  up: "Do now",
  right: "Today",
  left: "This week",
  down: "Let go",
};

const CARDS = [
  {
    tag: "work",
    title: "Reply to Harlow about the revised quote",
    body: "Due Friday. A short reply keeps the job.",
    meta: "Email · 10 min",
  },
  {
    tag: "work",
    title: "Collect materials from the merchant",
    body: "Open until five. Pair it with the Bath site visit.",
    meta: "Errand · 25 min",
  },
  {
    tag: "work",
    title: "Follow up with Render about the invoice",
    body: "Mentioned in three notes this week.",
    meta: "Email · 5 min",
  },
  {
    tag: "us",
    title: "Agree Saturday cover with Sam",
    body: "Two jobs booked and one van.",
    meta: "With others · 15 min",
  },
  {
    tag: "work",
    title: "Cancel the unused software subscription",
    body: "You've written this down four times.",
    meta: "Admin · 10 min",
  },
];

// Where the demo sends each card when it plays itself.
const PLAN: Dir[] = ["left", "right", "up", "left", "down"];

const EXIT: Record<Dir, string> = {
  up: "translate(0, -140%) rotate(-4deg)",
  down: "translate(0, 140%) rotate(4deg)",
  left: "translate(-150%, 0) rotate(-18deg)",
  right: "translate(150%, 0) rotate(18deg)",
};

export function SortDeck() {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState<Dir | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [counts, setCounts] = useState<Record<Dir, number>>({ up: 0, right: 0, left: 0, down: 0 });
  const [last, setLast] = useState<Dir | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [rootRef, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const { auto, interact } = useAutoplay();

  const done = index >= CARDS.length;

  // Plays itself on a loop: sorts every card, pauses on "All sorted", then starts over.
  // Any touch from the visitor pauses it; it resumes after a few idle seconds.
  useEffect(() => {
    if (!auto || !inView || reduced || exiting || drag.active) return;
    const t = window.setTimeout(
      () => {
        if (done) reset(false);
        else send(PLAN[index] ?? "right", false);
      },
      done ? 3400 : 2300,
    );
    return () => window.clearTimeout(t);
  }, [auto, inView, reduced, exiting, drag.active, done, index]);

  function send(dir: Dir, manual = true) {
    if (exiting || done) return;
    if (manual) interact();
    setExiting(dir);
    setLast(dir);
    window.setTimeout(() => {
      setCounts((c) => ({ ...c, [dir]: c[dir] + 1 }));
      setIndex((i) => i + 1);
      setExiting(null);
      setDrag({ x: 0, y: 0, active: false });
    }, 320);
  }

  function reset(manual = true) {
    if (manual) interact();
    setIndex(0);
    setCounts({ up: 0, right: 0, left: 0, down: 0 });
    setLast(null);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (exiting) return;
    interact();
    start.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: 0, y: 0, active: true });
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true });
  }
  function onPointerUp() {
    if (!start.current) return;
    start.current = null;
    const { x, y } = drag;
    const ax = Math.abs(x);
    const ay = Math.abs(y);
    if (Math.max(ax, ay) > 90) {
      send(ax > ay ? (x > 0 ? "right" : "left") : y > 0 ? "down" : "up");
    } else {
      setDrag({ x: 0, y: 0, active: false });
    }
  }
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const map: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const d = map[e.key];
    if (d) {
      e.preventDefault();
      send(d);
    }
  }

  const leaning: Dir | null =
    Math.max(Math.abs(drag.x), Math.abs(drag.y)) > 40
      ? Math.abs(drag.x) > Math.abs(drag.y)
        ? drag.x > 0
          ? "right"
          : "left"
        : drag.y > 0
          ? "down"
          : "up"
      : null;

  const sideBtn = (dir: Dir) =>
    cn(
      "flex items-center justify-center gap-2 rounded-full border border-night-line bg-night-card/70 text-sm font-bold text-night-foreground backdrop-blur transition-all hover:border-primary hover:text-primary disabled:opacity-40",
      (leaning === dir || exiting === dir) && "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
    );

  return (
    <div ref={rootRef} className="relative">
      <div className="mb-4 flex items-center justify-between text-night-muted">
        <div className="flex gap-1.5" aria-hidden>
          {CARDS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 w-6 rounded-full transition-colors",
                i < index ? "bg-primary" : i === index ? "bg-night-foreground" : "bg-night-line",
              )}
            />
          ))}
        </div>
        <span className="label-mono">
          {Math.min(index + 1, CARDS.length)} of {CARDS.length}
        </span>
      </div>

      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] grid-rows-[auto_minmax(0,1fr)_auto] gap-3">
        <div />
        <button className={cn(sideBtn("up"), "h-11")} onClick={() => send("up")} disabled={done}>
          <ArrowUp className="h-4 w-4" /> do now
        </button>
        <div />

        <button
          className={cn(sideBtn("left"), "h-full min-h-40 flex-col py-4")}
          onClick={() => send("left")}
          disabled={done}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="rotate-180 [writing-mode:vertical-rl]">this week</span>
        </button>

        <div
          className="relative h-[300px] touch-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[1.25rem]"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Task card. Use arrow keys to sort it."
        >
          {done ? (
            <div className="animate-slide-in flex h-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-night-line p-6 text-center">
              <Hopper tone="light" className="animate-float h-16 w-auto" />
              <p className="mt-4 font-display text-2xl font-bold text-night-foreground">
                All sorted.
              </p>
              <p className="mt-1 text-sm text-night-muted">
                {counts.up + counts.right} for today, {counts.left} later, {counts.down} let go.
              </p>
              <button
                onClick={() => reset()}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-night-line px-4 py-2 text-sm font-semibold text-night-foreground hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" /> Sort again
              </button>
            </div>
          ) : (
            CARDS.slice(index, index + 3)
              .reverse()
              .map((card, ri, arr) => {
                const depth = arr.length - 1 - ri;
                const isTop = depth === 0;
                const transform = isTop
                  ? exiting
                    ? EXIT[exiting]
                    : `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`
                  : `translateY(${depth * 12}px) scale(${1 - depth * 0.05})`;
                return (
                  <div
                    key={card.title}
                    onPointerDown={isTop ? onPointerDown : undefined}
                    onPointerMove={isTop ? onPointerMove : undefined}
                    onPointerUp={isTop ? onPointerUp : undefined}
                    onPointerCancel={isTop ? onPointerUp : undefined}
                    className={cn(
                      "absolute inset-0 flex flex-col rounded-[1.25rem] bg-cream-card p-6 text-ink shadow-float",
                      isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
                      !(isTop && drag.active && !exiting) &&
                        "transition-transform duration-300 ease-out",
                      isTop && exiting && "opacity-0 transition-[transform,opacity]",
                    )}
                    style={{ transform, zIndex: 10 - depth }}
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" /> {card.tag}
                    </p>
                    <h3 className="mt-3 font-display text-[28px] leading-[1.05] font-extrabold tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-[15px] text-ink-soft">{card.body}</p>
                    <p className="mt-auto flex items-center gap-2 text-sm font-semibold text-ink-soft">
                      <Clock className="h-4 w-4" /> {card.meta}
                    </p>
                  </div>
                );
              })
          )}
        </div>

        <button
          className={cn(sideBtn("right"), "h-full min-h-40 flex-col py-4")}
          onClick={() => send("right")}
          disabled={done}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="[writing-mode:vertical-rl]">today</span>
        </button>

        <div />
        <button className={cn(sideBtn("down"), "h-11")} onClick={() => send("down")} disabled={done}>
          <ArrowDown className="h-4 w-4" /> let go
        </button>
        <div />
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {(Object.keys(BUCKETS) as Dir[]).map((d) => (
          <div
            key={d}
            className={cn(
              "rounded-xl border border-night-line bg-night-card/60 px-3 py-2.5 transition-colors",
              last === d && "border-primary",
            )}
          >
            <p className="label-mono text-[10px] text-night-muted">{BUCKETS[d]}</p>
            <p
              key={`${d}-${counts[d]}`}
              className={cn(
                "font-display text-2xl font-bold text-night-foreground",
                counts[d] > 0 && "animate-slide-in",
              )}
            >
              {counts[d]}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-night-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Drag the card, tap a side, or use your arrow keys.
      </p>
    </div>
  );
}
