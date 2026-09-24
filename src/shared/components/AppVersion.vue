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
  border: 2px solid var(--neo-ink, #211914);
  border-radius: 5px;
  color: var(--neo-ink, #211914);
  background: var(--neo-butter, #ffe39a);
  box-shadow: 2px 2px 0 var(--neo-ink, #211914);
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
