<script setup>
import { secondaryIconCatalog } from '../icons/secondaryIconCatalog'

defineProps({
  name: { type: String, required: true },
  decorative: { type: Boolean, default: true },
})

const base = import.meta.env.BASE_URL

const icons = {
  hoy: `${base}icons/hoy.svg`,
  comidas: `${base}icons/comidas.svg`,
  entrenamientos: `${base}icons/entrenamientos.svg`,
  'estado-animo': `${base}icons/estado-animo.svg`,
  historial: `${base}icons/historial.svg`,
  'nuevo-registro': `${base}icons/nuevo-registro.svg`,
  saludo: `${base}icons/saludo.svg`,
  ...Object.fromEntries(Object.entries(secondaryIconCatalog).map(([name, icon]) => [name, base + icon.src.replace(/^\//, '')])),
}
</script>

<template>
  <img
    class="app-icon"
    :src="icons[name]"
    :alt="decorative ? '' : name"
    :aria-hidden="decorative ? 'true' : undefined"
  />
</template>
