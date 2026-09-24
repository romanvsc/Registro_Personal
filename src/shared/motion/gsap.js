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
    // A short power curve keeps the neo movement physical without a bounce.
    standard: 'power1.out',
    enter: 'power1.out',
    leave: 'power1.in',
  }),
  offset: Object.freeze({
    routeEnter: 10,
    routeLeave: -6,
    reveal: 10,
  }),
  rotation: Object.freeze({
    routeEnter: 0.7,
    routeLeave: -0.5,
    reveal: 0.8,
  }),
  scale: Object.freeze({
    routeEnter: 0.995,
    routeLeave: 0.998,
    reveal: 0.99,
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
