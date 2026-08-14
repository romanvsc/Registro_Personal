<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  adminEntryTypes,
  adminTypesError,
  adminTypesLoading,
  deleteEntryType,
  loadAdminEntryTypes,
} from '../application/entryTypeAdminStore'
import { pushToast } from '../../../shared/application/toastStore'
import AppIcon from '../../../shared/components/AppIcon.vue'
import ConfirmDialog from '../../../shared/components/ConfirmDialog.vue'

const router = useRouter()
const base = import.meta.env.BASE_URL

const deleting = ref(null)
const deletingBusy = ref(false)
const deleteMessage = ref('')

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
      <div><p class="eyebrow">CONFIGURACIÓN</p><h1>Tipos de registro</h1><p>Definí qué momentos querés registrar y con qué campos.</p></div>
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
          <p>{{ type.slug }} · {{ type.fields.length }} campo{{ type.fields.length === 1 ? '' : 's' }}</p>
          <span class="field-chips"><em v-for="field in type.fields" :key="field.key">{{ field.label }}</em></span>
        </div>
        <div class="type-admin-card__actions">
          <RouterLink class="mini-link" :to="`/configuracion/tipos/${type.id}`">Editar</RouterLink>
          <button class="mini-link mini-link--danger" type="button" @click="confirmDelete(type)">Eliminar</button>
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
.type-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.type-admin-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--sand-200);
  border-radius: 20px;
  background: var(--cream-50);
}

.type-admin-card.is-inactive {
  opacity: 0.72;
}

.type-admin-card__icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--felicia-50);
}

.type-admin-card__icon .app-icon {
  width: 52px;
  height: 52px;
}

.type-admin-card h2 {
  margin: 0 0 4px;
  font: 800 17px Nunito;
}

.type-admin-card h2 small {
  font-size: 10px;
}

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

.field-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.field-chips em {
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--sand-100);
  color: var(--cocoa-700);
  font-size: 12px;
  font-style: normal;
}

.type-admin-card__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.type-admin-card__actions .mini-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  min-height: 44px;
  padding: 0 10px;
  border-radius: 10px;
  font-size: 14px;
}

.type-admin-card__actions .mini-link:hover {
  background: var(--dorito-50);
  text-decoration: none;
}

.type-admin-card__actions .mini-link--danger:hover {
  background: var(--danger-50);
}

@media (max-width: 600px) {
  .type-admin-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .type-admin-card {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 16px;
  }

  .type-admin-card__actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    padding-top: 8px;
    border-top: 1px solid var(--sand-200);
  }

  .type-admin-card__actions .mini-link {
    flex: 1;
  }
}
</style>
