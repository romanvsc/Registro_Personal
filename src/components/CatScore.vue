<script setup>
import { computed } from 'vue'
import { catFor } from '../lib/entries'

const props = defineProps({ score: { type: Number, required: true }, size: { type: String, default: 'md' } })
const cat = computed(() => catFor(props.score))
</script>

<template>
  <div class="cat-score" :class="[cat.color, size]">
    <img :src="cat.image" :alt="`${cat.name}, ${cat.mood}`" />
    <strong>{{ score }}</strong>
  </div>
</template>
