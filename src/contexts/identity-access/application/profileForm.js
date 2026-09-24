const PROFILE_FIELDS = ['name', 'avatarKey', 'biography', 'currentPassword', 'password', 'passwordConfirmation']

export function snapshotProfileForm(form) {
  return PROFILE_FIELDS.reduce((snapshot, field) => {
    snapshot[field] = form?.[field] ?? (field === 'avatarKey' ? null : '')
    return snapshot
  }, {})
}

export function hasProfileChanges(form, baseline, passwordChangeEnabled = false) {
  if (!baseline) return false

  const current = snapshotProfileForm(form)
  const comparableFields = ['name', 'avatarKey', 'biography']
  if (comparableFields.some(field => current[field] !== baseline[field])) return true

  if (!passwordChangeEnabled) return false
  return ['currentPassword', 'password', 'passwordConfirmation']
    .some(field => current[field] !== baseline[field])
}

