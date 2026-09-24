import assert from 'node:assert/strict'
import { MOTION, motionDuration } from '../src/shared/motion/gsap.js'

assert.equal(motionDuration(MOTION.duration.route, false), MOTION.duration.route)
assert.equal(motionDuration(MOTION.duration.route, true), 0)
assert.equal(MOTION.stagger, 0.04)
assert.equal(MOTION.duration.flip, 0.24)

console.log('Motion policy tests: OK')
