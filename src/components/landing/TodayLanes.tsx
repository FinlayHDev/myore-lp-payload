"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Layers, ListFilter, Pause, Pencil, Play, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hopper } from "./Hopper";
import { cn } from "@/lib/utils";
import { useAutoplay, useInView, usePrefersReducedMotion } from "@/hooks/use-autoplay";

type Task = { id: number; title: string; tag?: string; minutes: number; done: boolean };
const INITIAL: Task[] = [
  { id: 1, title: "Call supplier", tag: "#Call supplier", minutes: 25, done: false },
  { id: 2, title: "Send Jo the revised quote", minutes: 25, done: false },
];
const DAYS = [["Mon", 9], ["Tue", 10], ["Wed", 11], ["Thu", 12], ["Fri", 13], ["Sat", 14], ["Sun", 15]] as const;
export function loadLabel(left: number) {
  if (left === 0) return "Clear. Day done.";
  if (left <= 1) return "Nearly there";
  if (left <= 3) return "Comfortably full";
  return "A full day";
}

export function TodayLanes() {
  const [tasks, setTasks] = useState(INITIAL);
  const [day, setDay] = useState(9);
  const [view, setView] = useState<"list" | "split">("list");
  const [timer, setTimer] = useState<{ id: number; left: number; running: boolean } | null>({ id: 2, left: 0, running: false });
  // Accelerated preview timer; one demo minute elapses every 200ms.
  useEffect(() => {
    if (!timer?.running || timer.left <= 0) return;
    const tick = setTimeout(() => setTimer((current) => current ? { ...current, left: current.left - 1 } : null), 200);
    return () => clearTimeout(tick);
  }, [timer]);
  const doneCount = tasks.filter((task) => task.done).length;
  const remaining = tasks.filter((task) => !task.done);
  const minutes = remaining.reduce((total, task) => total + task.minutes, 0);
  const timedTask = tasks.find((task) => task.id === timer?.id && !task.done);
  const expired = timer?.left === 0;
  const [rootRef, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const { auto, interact } = useAutoplay();

  // Plays itself on a loop: runs the timer, ticks each task off, shows the clear cart, then restarts.
  // A visitor's tap pauses it; it resumes after a few idle seconds.
  useEffect(() => {
    if (!auto || !inView || reduced) return;
    let t: number | undefined;
    if (view === "split") {
      t = window.setTimeout(() => setView("list"), 5000);
    } else if (remaining.length === 0) {
      t = window.setTimeout(() => {
        setTasks(INITIAL);
        setTimer({ id: 2, left: 0, running: false });
        setDay(9);
      }, 3400);
    } else if (!timer) {
      const next = remaining[0];
      if (next) t = window.setTimeout(() => startTimer(next.id), 1500);
    } else if (timer.left === 0) {
      t = window.setTimeout(() => toggle(timer.id), 1700);
    } else if (!timer.running) {
      t = window.setTimeout(() => setTimer((c) => (c ? { ...c, running: true } : null)), 1200);
    }
    return () => window.clearTimeout(t);
  }, [auto, inView, reduced, view, timer, tasks]);
  function toggle(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
    if (timer?.id === id) setTimer(null);
  }
  function startTimer(id: number) {
    setTimer((current) => current?.id === id && current.left > 0
      ? { ...current, running: !current.running }
      : { id, left: 25, running: true });
  }
  const selectedDay = DAYS.find((entry) => entry[1] === day);
  const dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][DAYS.findIndex((entry) => entry[1] === day)];

  return (
    <div ref={rootRef} onPointerDownCapture={interact} onKeyDownCapture={interact} aria-label="Interactive Today preview" className="today-screen overflow-hidden rounded-[1.25rem] border border-night-line bg-today-background text-night-foreground shadow-float">
      <div className="px-5 pt-7 sm:px-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-night-muted uppercase">{dayName} · {day} Nov</p>
            <h4 className="mt-1 text-5xl leading-tight font-bold">Today</h4>
          </div>
          <div className="flex shrink-0 items-center gap-2 pb-2 font-mono text-lg font-bold text-night-muted">
            <Hopper tone="light" className="h-7 w-auto" />
            <span aria-live="polite">{doneCount} / {tasks.length}</span>
          </div>
        </header>
        <div className="mt-5 h-0.5 bg-night-line" role="progressbar" aria-label="Today's completion" aria-valuemin={0} aria-valuemax={2} aria-valuenow={doneCount}>
          <div className="h-full min-w-1 bg-primary transition-[width] duration-500" style={{ width: `${doneCount / tasks.length * 100}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-sm text-night-muted">
          <p aria-live="polite">{remaining.length === 0 ? "All done" : `${remaining.length} left · about ${minutes} min`}</p>
          <p>Capacity {remaining.length} of 6</p>
        </div>
        <div className="mt-7 grid grid-cols-7 gap-1.5" aria-label="Choose a day">
          {DAYS.map(([label, date]) => (
            <Button key={date} variant="ghost" aria-label={`${label} ${date} November`} aria-pressed={day === date} onClick={() => setDay(date)} className={cn("today-day h-14 min-w-0 flex-col gap-0 rounded-xl border border-night-line px-0 text-night-muted", day === date && "today-day-selected")}>
              <span className="text-xs">{label}</span><span className="text-xl font-bold">{date}</span>
            </Button>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => setView(view === "list" ? "split" : "list")} aria-pressed={view === "split"} title="Split calendar with Sam" className="today-quiet gap-1.5 text-xs text-night-muted">
            <CalendarDays />{view === "split" ? "Back to list" : "Split with Sam"}
          </Button>
        </div>
      </div>
      <div className="min-h-[390px] pt-2">
        {view === "split" ? <div className="px-5 pb-6"><SplitView /></div> : (
          <div>
            {tasks.map((task, index) => {
              const isTimed = timedTask?.id === task.id;
              const timeUp = isTimed && expired;
              return (
                <section key={task.id} className="mb-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-5 sm:px-6">
                    <p className="flex min-w-0 items-center gap-4 font-mono text-xs font-bold uppercase"><span className="ml-1 h-2.5 w-2.5 shrink-0 rotate-45 bg-primary" />{index === 0 ? "Quick wins" : "With others"}</p>
                    <p className="font-mono text-[11px] text-night-muted">{task.done ? "all done" : index === 0 ? "1 left · under 25 min" : "1 left"}</p>
                  </div>
                  <div className={cn("today-task relative mt-1 px-5 py-4 sm:px-6", timeUp && "today-task-expired")}>
                    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
                      <Button variant="ghost" size="icon" aria-label={`${task.done ? "Undo completion of" : "Complete"} ${task.title}`} aria-pressed={task.done} onClick={() => toggle(task.id)} className={cn("today-check relative z-10 mt-1 h-6 w-6 rounded-full border-2 border-night-muted p-0", task.done && "today-check-done", timeUp && "today-check-expired")}>
                        {task.done && <Check />}
                      </Button>
                      <div className="min-w-0">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                          <p className={cn("text-lg leading-snug font-medium", task.done && "text-night-muted line-through")}>{task.title}</p>
                          {!task.done && !timeUp && <Button variant="ghost" size="sm" onClick={() => startTimer(task.id)} aria-label={`${isTimed && timer?.running ? "Pause" : "Start"} a 25 minute timer for ${task.title}`} className="today-quiet h-8 gap-2 px-0 text-night-muted"><span className="font-mono text-xs">{isTimed ? `${timer?.left}m` : "25m"}</span>{isTimed && timer?.running ? <Pause /> : <Play />}</Button>}
                        </div>
                        {task.tag && <p className="mt-1 text-sm text-night-muted">{task.tag}</p>}
                        {timeUp && <>
                          <p className="mt-2 font-mono text-xs font-bold text-today-notice uppercase">Time's up · 25 min</p>
                          <div className="mt-5 grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                            <Button onClick={() => toggle(task.id)} className="today-done h-11 rounded-full text-base font-bold">Done</Button>
                            <Button variant="ghost" onClick={() => setTimer({ id: task.id, left: 10, running: true })} className="today-extra h-11 rounded-full border border-night-muted px-2 text-base font-semibold">+10 min</Button>
                            <Button variant="ghost" onClick={() => setTimer(null)} className="today-quiet h-11 px-1 text-sm text-night-muted">Not yet</Button>
                          </div>
                        </>}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
            {remaining.length === 0 && <p className="px-6 py-6 text-center text-night-muted">{loadLabel(0)}</p>}
          </div>
        )}
      </div>
      <div className="px-4 pb-4">
        {timer && timedTask ? (
          <div className="today-timer grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-3 rounded-2xl border border-night-line bg-night-card px-4 py-3">
            <div className="min-w-0"><p className="font-mono text-[10px] font-bold text-night-muted uppercase">{expired ? "Time's up" : timer.running ? "Focus timer" : "Paused"}</p><p className="mt-1 truncate text-sm font-semibold">{timedTask.title}</p></div>
            <span className="font-mono text-2xl font-bold tabular-nums" aria-live="off">{String(timer.left).padStart(2, "0")}:00</span>
            <Button variant="ghost" size="icon" onClick={() => startTimer(timedTask.id)} aria-label={timer.running && !expired ? "Pause focus timer" : "Resume focus timer"} className="today-quiet h-7 w-7">{timer.running && !expired ? <Pause /> : <Play />}</Button>
            <Button size="icon" onClick={() => toggle(timedTask.id)} aria-label="Complete timed task" className="today-done h-11 w-11 rounded-full"><Check /></Button>
          </div>
        ) : <div className="flex h-[74px] items-center px-2 text-sm text-night-muted">{remaining.length ? `${selectedDay?.[0]} · ${loadLabel(remaining.length)}` : "A clear cart. A little time back."}</div>}
      </div>
      <nav aria-label="App preview navigation" className="grid grid-cols-5 items-end border-t border-night-line px-2 pt-3 pb-5">
        <Button variant="ghost" onClick={() => setView("list")} className="today-nav today-nav-active"><Sun /><span>Today</span></Button>
        <Button variant="ghost" asChild className="today-nav"><a href="#sort"><ListFilter /><span>Sort</span></a></Button>
        <Button variant="ghost" asChild className="today-nav today-nav-scratch"><a href="#top"><span className="today-pencil"><Pencil /></span><span>Scratchpad</span></a></Button>
        <Button variant="ghost" asChild className="today-nav"><a href="#agents"><Sparkles /><span>Agents</span></a></Button>
        <Button variant="ghost" asChild className="today-nav"><a href="#agents"><Layers /><span>HQ</span></a></Button>
      </nav>
    </div>
  );
}

const SPLIT = [
  { start: 9, end: 11, you: "Site visit · Bath", sam: "Busy" },
  { start: 12, end: 13, you: "Site visit with Sam", sam: "Site visit with you", shared: true },
  { start: 15, end: 16.5, you: null, sam: "Busy" },
];

function SplitView() {
  const top = 8, span = 9;
  return (
    <div className="mt-5">
      <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-xs">
        <span />
        <p className="font-bold">You <span className="font-normal text-night-muted">· free 5h</span></p>
        <p className="font-bold">Sam <span className="font-normal text-night-muted">· busy only</span></p>
      </div>
      <div className="relative mt-2 h-72 rounded-2xl bg-night-card">
        {[9, 11, 13, 15, 17].map((h) => (
          <div key={h} className="absolute inset-x-0 border-t border-night-line" style={{ top: `${((h - top) / span) * 100}%` }}>
            <span className="absolute left-2 -translate-y-1/2 bg-night-card px-1 text-[10px] text-night-muted">{h}:00</span>
          </div>
        ))}
        {SPLIT.map((b) => {
          const style = { top: `${((b.start - top) / span) * 100}%`, height: `${((b.end - b.start) / span) * 100}%` };
          return b.shared ? (
            <div key={b.start} style={style} className="absolute left-12 right-2 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
              Site visit with Sam · 12:00–13:00
            </div>
          ) : (
            <div key={b.start}>
              {b.you && (
                <div style={style} className="absolute left-12 w-[calc(50%-2.5rem)] rounded-xl bg-token-date-bg px-2 py-1.5 text-xs font-bold text-token-date">{b.you}</div>
              )}
              <div style={style} className="absolute right-2 w-[calc(50%-2.5rem)] rounded-xl border border-dashed border-night-muted px-2 py-1.5 text-xs text-night-muted">{b.sam}</div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-night-muted">Hopper finds the gaps you both share. Sam only shares when, not what.</p>
    </div>
  );
}
