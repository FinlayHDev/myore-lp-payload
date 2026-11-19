"use client";

import { useState, type FormEvent } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Copy = { placeholder: string; buttonLabel: string; helper: string; successTitle: string };
const DEFAULT_COPY: Copy = {
  placeholder: "Work email",
  buttonLabel: "Join the waitlist",
  helper: "One email when the first release is ready. No newsletter.",
  successTitle: "You're on the list.",
};

export function WaitlistForm({
  tone = "paper",
  source = "other",
  copy = DEFAULT_COPY,
}: {
  tone?: "paper" | "night";
  source?: "hero" | "footer" | "other";
  copy?: Copy;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [trap, setTrap] = useState("");
  const night = tone === "night";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const value = email.trim();
    if (!EMAIL_RE.test(value) || value.length > 255) {
      setError("That email doesn't look quite right.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, company: trap }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div
        className={cn(
          "animate-slide-in flex items-start gap-4 border p-5",
          night ? "border-night-line bg-night-card" : "border-hairline bg-card",
        )}
        role="status"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className={cn("font-semibold", night && "text-night-foreground")}>
            {copy.successTitle}
          </p>
          <p className={cn("mt-1 text-sm", night ? "text-night-muted" : "text-muted-foreground")}>
            Hopper will send one email to <span className="break-all">{email}</span> when the
            first release is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div
        className={cn(
          "flex flex-col border sm:flex-row",
          night ? "border-night-line" : "border-hairline",
          error && "border-destructive",
        )}
      >
        <label htmlFor={`email-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${tone}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={copy.placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          className={cn(
            "h-14 w-full min-w-0 px-5 sm:flex-1 text-base outline-none placeholder:opacity-60",
            night
              ? "bg-night-card text-night-foreground placeholder:text-night-muted"
              : "bg-card text-ink placeholder:text-muted-foreground",
          )}
        />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "group inline-flex h-14 disabled:opacity-70 items-center justify-center gap-3 px-7 font-semibold transition-colors",
            night
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-ink text-paper hover:bg-primary",
          )}
        >
          {busy ? "Joining…" : copy.buttonLabel}
        </button>
      </div>
      <p
        className={cn(
          "mt-3 flex items-center gap-2 text-sm",
          error ? "text-destructive" : night ? "text-night-muted" : "text-muted-foreground",
        )}
      >
        {!error && <Lock className="h-3.5 w-3.5 shrink-0" />}
        {error ?? copy.helper}
      </p>
    </form>
  );
}
