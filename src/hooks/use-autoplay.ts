"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** True when the visitor asks the OS for reduced motion. Demos then stay still. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Tracks whether an element is on screen, so off-screen demos don't keep running. */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/**
 * Lets a demo play itself on a loop. When the visitor touches it, autoplay pauses
 * and quietly resumes after `idleMs` with no further input.
 */
export function useAutoplay(idleMs = 9000) {
  const [auto, setAuto] = useState(true);
  const timer = useRef<number | undefined>(undefined);
  const interact = useCallback(() => {
    setAuto(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAuto(true), idleMs);
  }, [idleMs]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { auto, interact };
}
