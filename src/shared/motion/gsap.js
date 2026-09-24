import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

export const MOTION = Object.freeze({
  duration: Object.freeze({
    route: 0.2,
    reveal: 0.28,
    flip: 0.24,
    filterOpen: 0.22,
    filterClose: 0.18,
  }),
  ease: Object.freeze({
    standard: 'power2.out',
    enter: 'power2.out',
    leave: 'power1.in',
  }),
  stagger: 0.04,
})

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function motionDuration(duration, reduced = prefersReducedMotion()) {
  return reduced ? 0 : duration
}

export function createMotionContext(scope, setup) {
  if (!scope || typeof setup !== 'function') return null
  return gsap.context(setup, scope)
}

export { Flip, gsap }
