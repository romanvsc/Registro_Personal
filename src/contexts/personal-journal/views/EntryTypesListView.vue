<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  adminEntryTypes,
  adminTypesError,
  adminTypesLoading,
  deleteEntryType,
  loadAdminEntryTypes,
  updateEntryType,
} from '../application/entryTypeAdminStore'
import { pushToast } from '../../../shared/application/toastStore'
import AppIcon from '../../../shared/components/AppIcon.vue'
import ConfirmDialog from '../../../shared/components/ConfirmDialog.vue'

const router = useRouter()
const base = import.meta.env.BASE_URL

const deleting = ref(null)
const deletingBusy = ref(false)
const deleteMessage = ref('')
const reactivating = ref(null)

function getErrorMessage(error, fallback) {
  const message = error instanceof Error ? error.message.trim() : ''
  if (message && !['undefined', 'null', '[object Object]'].includes(message)) return message
  return fallback
}

function confirmDelete(type) {
  deleting.value = type
  deleteMessage.value = type.active
    ? 'Se desactivará el tipo. Los registros existentes se conservan y dejan de aparecer como opción.'
    : 'Se eliminará el tipo de registro. Los registros existentes se conservan.'
}

async function runDelete() {
  if (deleting.value === null) return
  deletingBusy.value = true
  try {
    const result = await deleteEntryType(deleting.value.id)
    pushToast({
      type: 'success',
      message: result.deactivated ? 'Tipo desactivado.' : 'Tipo eliminado.',
      duration: 3000,
    })
    deleting.value = null
  } catch (error) {
    pushToast({
      type: 'error',
      message: getErrorMessage(error, 'Ocurrió un problema. Intentá nuevamente.'),
      duration: 5000,
    })
    deleting.value = null
  } finally {
    deletingBusy.value = false
  }
}

async function reactivate(type) {
  if (reactivating.value !== null) return
  reactivating.value = type.id
  try {
    await updateEntryType(type.id, { active: true })
    pushToast({
      type: 'success',
      message: 'Tipo reactivado.',
      duration: 3000,
    })
  } catch (error) {
    pushToast({
      type: 'error',
      message: getErrorMessage(error, 'No se pudo reactivar el tipo.'),
      duration: 5000,
    })
  } finally {
    reactivating.value = null
  }
}

function cancelDelete() {
  deleting.value = null
  deleteMessage.value = ''
  deletingBusy.value = false
}

onMounted(loadAdminEntryTypes)
</script>

<template>
  <div class="page admin-page" :aria-busy="adminTypesLoading">
    <header class="page-header">
      <div><p class="eyebrow">CONFIGURACIÓN</p><h1>Tipos de registro</h1><p>Elegí qué momentos querés guardar y qué preguntas querés responder.</p></div>
      <RouterLink class="primary-button" to="/configuracion/tipos/nuevo"><AppIcon name="nuevo-registro" /> Nuevo tipo</RouterLink>
    </header>

    <p v-if="adminTypesLoading" class="soft-label" role="status">Cargando tipos…</p>
    <div v-else-if="adminTypesError" class="entry-list-empty" role="alert">
      <img :src="base + 'cats/felipa-molesta.png'" alt="" />
      <div><h3>No pudimos cargar los tipos</h3><p>{{ adminTypesError }}</p><button class="primary-button" type="button" @click="loadAdminEntryTypes">Reintentar</button></div>
    </div>

    <div v-else-if="adminEntryTypes.length" class="type-admin-grid">
      <article v-for="type in adminEntryTypes" :key="type.id" class="type-admin-card" :class="{ 'is-inactive': !type.active }">
        <span class="type-admin-card__icon"><AppIcon :name="type.icon" /></span>
        <div class="type-admin-card__body">
          <h2>{{ type.name }} <small v-if="!type.active" class="inactive-badge">Inactivo</small></h2>
          <p>{{ type.fields.length }} pregunta{{ type.fields.length === 1 ? '' : 's' }}</p>
          <span class="field-chips"><em v-for="field in type.fields" :key="field.key">{{ field.label }}</em></span>
        </div>
        <div class="type-admin-card__actions">
          <RouterLink class="mini-link" :to="`/configuracion/tipos/${type.id}`">Editar</RouterLink>
          <button
            v-if="type.active"
            class="mini-link mini-link--danger"
            type="button"
            @click="confirmDelete(type)"
          >Eliminar</button>
          <button
            v-else
            class="mini-link"
            type="button"
            :disabled="reactivating === type.id"
            @click="reactivate(type)"
          >{{ reactivating === type.id ? 'Reactivando…' : 'Reactivar' }}</button>
        </div>
      </article>
    </div>

    <div v-else class="entry-list-empty">
      <img :src="base + 'cats/felipa-molesta.png'" alt="" />
      <div><h3>No hay tipos de registro</h3><p>Creá tu primer tipo para empezar a registrar momentos.</p></div>
    </div>

    <ConfirmDialog v-if="deleting !== null" title="¿Eliminar este tipo?" :message="deleteMessage" confirm-label="Eliminar" :busy="deletingBusy" @confirm="runDelete" @cancel="cancelDelete" />
  </div>
</template>

<style scoped>
.type-admin-card p {
  margin: 0 0 8px;
  color: var(--cocoa-700);
  font-size: 14px;
  line-height: 1.45;
}

.inactive-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--sand-200);
  color: var(--cocoa-600);
  vertical-align: middle;
}

/* PersonalJournal: catálogo modular con bloques, rails y sombras sólidas. */
.admin-page .page-header {
  padding-left: 18px;
  border-left: 6px solid var(--dorito-500);
}

.admin-page .page-header h1 {
  color: var(--cocoa-950);
  letter-spacing: -0.03em;
}

.admin-page .page-header .primary-button {
  border: 2px solid var(--cocoa-950);
  border-radius: 7px;
  color: var(--cocoa-950);
  background: var(--dorito-300);
  box-shadow: 4px 4px 0 var(--cocoa-950);
}

.admin-page .page-header .primary-button:hover {
  color: var(--cocoa-950);
  background: var(--dorito-400);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--cocoa-950);
}

.type-admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.type-admin-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 14px;
  padding: 20px;
  border: 3px solid var(--cocoa-950);
  border-radius: 10px;
  background: var(--cream-50);
  min-width: 0;
  border-left-width: 8px;
  border-left-color: var(--dorito-500);
  box-shadow: 5px 5px 0 var(--cocoa-950);
  transition: transform .16s ease, box-shadow .16s ease;
}

.type-admin-card:nth-child(3n + 2) {
  border-left-color: var(--felicia-500);
  background: var(--felicia-50);
}

.type-admin-card:nth-child(3n + 3) {
  border-left-color: var(--dorito-400);
  background: var(--dorito-50);
}

.type-admin-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--cocoa-950);
}

.type-admin-card.is-inactive {
  opacity: .76;
  border-left-color: var(--cocoa-600);
  background: repeating-linear-gradient(-45deg, var(--sand-50), var(--sand-50) 8px, var(--sand-100) 8px, var(--sand-100) 16px);
}

.type-admin-card__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: var(--cream-50);
  border: 2px solid var(--cocoa-950);
  box-shadow: 3px 3px 0 var(--cocoa-950);
}

.type-admin-card__icon .app-icon {
  width: 48px;
  height: 48px;
}

.type-admin-card h2 {
  margin: 0 0 4px;
  font: 800 17px var(--font-display);
  color: var(--cocoa-950);
  letter-spacing: -0.01em;
}

.type-admin-card h2 small {
  font-size: 10px;
  padding: 3px 7px;
  border: 2px solid var(--cocoa-950);
  border-radius: 5px;
  color: var(--cocoa-950);
  background: var(--sand-100);
  font-weight: 800;
}

.field-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.field-chips em {
  padding: 5px 9px;
  border-radius: 5px;
  background: var(--cream-50);
  color: var(--cocoa-950);
  font-size: 12px;
  font-style: normal;
  border: 1px solid var(--cocoa-700);
  font-weight: 700;
}

.type-admin-card__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.type-admin-card__actions .mini-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 82px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 14px;
  border: 2px solid var(--cocoa-950);
  color: var(--cocoa-950);
  background: var(--cream-50);
  box-shadow: 3px 3px 0 var(--cocoa-950);
  font-weight: 800;
}

.type-admin-card__actions .mini-link:hover {
  background: var(--dorito-100);
  text-decoration: none;
  color: var(--cocoa-950);
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cocoa-950);
}

.type-admin-card__actions .mini-link--danger {
  border-color: var(--danger-700);
  color: var(--danger-700);
  box-shadow: 3px 3px 0 var(--danger-700);
}

.type-admin-card__actions .mini-link--danger:hover {
  background: var(--danger-50);
  color: var(--danger-700);
  box-shadow: 5px 5px 0 var(--danger-700);
}

.entry-list-empty {
  position: relative;
  min-height: 154px;
  padding-right: 176px;
  overflow: hidden;
  border: 3px dashed var(--cocoa-950);
  border-radius: 10px;
  background: var(--felicia-50);
  box-shadow: 5px 5px 0 var(--cocoa-950);
}

.entry-list-empty > img {
  position: absolute;
  right: -12px;
  bottom: -14px;
  z-index: 0;
  width: 154px;
  height: 154px;
  object-fit: contain;
  pointer-events: none;
}

.entry-list-empty > div {
  position: relative;
  z-index: 1;
  max-width: 52ch;
}

.entry-list-empty .primary-button {
  border: 2px solid var(--cocoa-950);
  border-radius: 6px;
  color: var(--cocoa-950);
  background: var(--dorito-300);
  box-shadow: 3px 3px 0 var(--cocoa-950);
}

@media (max-width: 720px) {
  .type-admin-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 600px) {
  .type-admin-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .entry-list-empty {
    min-height: 136px;
    padding-right: 118px;
  }

  .entry-list-empty > img {
    right: -8px;
    bottom: -10px;
    width: 112px;
    height: 112px;
  }

  .type-admin-card__actions .mini-link {
    flex: 1;
  }
  .admin-page .page-header {
    padding-left: 12px;
  }

  .type-admin-card {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 16px;
    box-shadow: 4px 4px 0 var(--cocoa-950);
  }

  .type-admin-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--cocoa-950);
  }

  .type-admin-card__actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    padding-top: 8px;
    border-top: 2px solid var(--cocoa-950);
  }
}

@media (prefers-reduced-motion: reduce) {
  .type-admin-card {
    transition: none;
  }
  .type-admin-card__actions .mini-link {
    transition: none;
  }
  .admin-page .page-header .primary-button {
    transition: none;
  }

  .type-admin-card:hover {
    transform: none;
  }

  .type-admin-card__actions .mini-link:hover {
    transform: none;
  }

  .admin-page .page-header .primary-button:hover {
    transform: none;
  }
}
</style>
