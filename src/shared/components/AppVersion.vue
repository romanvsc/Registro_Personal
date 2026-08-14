<script setup>
import packageMetadata from '../../../package.json'

const version = packageMetadata.version
</script>

<template>
  <small class="app-version" :aria-label="`Versión de la aplicación ${version}`">v{{ version }}</small>
</template>

<style scoped>
.app-version {
  position: fixed;
  right: 10px;
  bottom: 7px;
  z-index: 8;
  padding: 2px 6px;
  border: 1px solid rgba(229, 219, 207, .72);
  border-radius: 999px;
  color: var(--cocoa-600, #756357);
  background: rgba(255, 252, 247, .88);
  box-shadow: 0 2px 8px rgba(76, 61, 47, .05);
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: .03em;
  pointer-events: none;
  user-select: none;
}

@media (max-width: 600px) {
  .app-version {
    right: 7px;
    bottom: 5px;
    font-size: 10px;
  }
}
</style>
