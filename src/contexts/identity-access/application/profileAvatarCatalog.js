const assetsBase = import.meta.env.BASE_URL

export const PROFILE_AVATARS = Object.freeze([
  { key: 'dorito-feliz', label: 'Dorito feliz' },
  { key: 'dorito-guino', label: 'Dorito guiñando un ojo' },
  { key: 'dorito-notas', label: 'Dorito tomando notas' },
  { key: 'dorito-amor', label: 'Dorito expresando amor' },
  { key: 'felicia-atenta', label: 'Felicia atenta' },
  { key: 'felicia-dormida', label: 'Felicia dormida' },
  { key: 'felicia-saludo', label: 'Felicia saludando' },
  { key: 'felipa-seria', label: 'Felipa seria' },
  { key: 'felipa-candado', label: 'Felipa con un candado' },
  { key: 'felipa-entrenamiento', label: 'Felipa entrenando' },
].map(avatar => Object.freeze({
  ...avatar,
  src: `${assetsBase}profile-icons/${avatar.key}.svg`,
})))

const avatarsByKey = new Map(PROFILE_AVATARS.map(avatar => [avatar.key, avatar]))

export function findProfileAvatar(avatarKey) {
  return typeof avatarKey === 'string' ? avatarsByKey.get(avatarKey) ?? null : null
}
