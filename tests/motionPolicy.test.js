import assert from 'node:assert/strict'
import { MOTION, motionDuration } from '../src/shared/motion/gsap.js'

assert.equal(motionDuration(MOTION.duration.route, false), MOTION.duration.route)
assert.equal(motionDuration(MOTION.duration.route, true), 0)
assert.equal(MOTION.stagger, 0.04)
assert.equal(MOTION.duration.flip, 0.24)
assert.equal(MOTION.ease.standard, 'power1.out')
assert.ok(MOTION.offset.reveal <= 12)
assert.ok(MOTION.rotation.reveal <= 1)
assert.ok(MOTION.scale.reveal > 0.98 && MOTION.scale.reveal < 1)

console.log('Motion policy tests: OK')
