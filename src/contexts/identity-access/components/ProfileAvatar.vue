<script setup>
import { computed } from 'vue'
import { findProfileAvatar } from '../application/profileAvatarCatalog'

const props = defineProps({
  user: { type: Object, default: null },
  avatarKey: { type: String, default: null },
  name: { type: String, default: '' },
  size: { type: String, default: 'md', validator: value => ['sm', 'md', 'lg', 'xl'].includes(value) },
  decorative: { type: Boolean, default: false },
})

const displayName = computed(() => props.name || props.user?.name || props.user?.email || 'Usuario')
const avatar = computed(() => findProfileAvatar(props.avatarKey ?? props.user?.avatarKey))
const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  return parts.slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase('es-AR')
})
const accessibleLabel = computed(() => `Avatar de ${displayName.value}`)
</script>

<template>
  <span class="profile-avatar" :class="`profile-avatar--${size}`">
    <img v-if="avatar" :src="avatar.src" :alt="decorative ? '' : accessibleLabel" />
    <span v-else class="profile-avatar__initials" :role="decorative ? undefined : 'img'" :aria-label="decorative ? undefined : accessibleLabel" :aria-hidden="decorative || undefined">{{ initials }}</span>
  </span>
</template>

<style scoped>
.profile-avatar--lg { --avatar-size: 72px; }
.profile-avatar--xl { --avatar-size: 116px; }

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar__initials {
  color: var(--cocoa-900, #302720);
  font: 800 calc(var(--avatar-size) * .34)/1 var(--font-display);
  letter-spacing: -.03em;
}

/* Avatars stay round; their cocoa keyline ties them to the new system. */
.profile-avatar {
  --avatar-size: 48px;
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  width: var(--avatar-size);
  height: var(--avatar-size);
  flex: none; border: 3px solid var(--cocoa-950, #302720);
  border-radius: 50%; background: var(--dorito-100, #ffe0bd); box-shadow: 3px 3px 0 var(--cocoa-950, #302720); }
.profile-avatar--sm { --avatar-size: 36px; border-width: 2px; box-shadow: 2px 2px 0 var(--cocoa-950, #302720); }
</style>
