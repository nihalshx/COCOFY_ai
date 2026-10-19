import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis = null;
export function getLenis() { return lenis; }

export function startLenis() {
  // Phones and tablets keep their own native (momentum) scrolling; smooth scrolling is for mouse and trackpad only.
  if (reduceMotion || lenis || !finePointer) return lenis;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

const PINNED = ['#climb', '#equipment'];
export function scrollToId(id, immediate = false) {
  const target = id === '#top' ? 0 : document.querySelector(id);
  if (target == null) return;
  const offset = PINNED.includes(id) ? 0 : -70;
  if (lenis) { lenis.start(); if (lenis.resize) lenis.resize(); lenis.scrollTo(target, { offset, immediate, force: true }); }
  else if (target === 0) window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? 'auto' : 'smooth' });
}

// The intro (loader) plays once per visit.
export const session = { introPlayed: false };
