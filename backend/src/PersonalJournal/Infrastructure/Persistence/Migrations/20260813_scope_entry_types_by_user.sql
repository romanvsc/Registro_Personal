-- Fase 1+2 V2: los tipos de registro pasan a pertenecer a un usuario.
-- Los 3 tipos existentes se asignan al usuario demo (id=1). No se modifican migraciones previas.

ALTER TABLE entry_types
  ADD COLUMN user_id BIGINT UNSIGNED NOT NULL AFTER id;

UPDATE entry_types SET user_id = 1 WHERE user_id = 0 OR user_id IS NULL;

ALTER TABLE entry_types
  DROP KEY uq_entry_types_slug,
  ADD UNIQUE KEY uq_entry_types_user_slug (user_id, slug),
  ADD KEY idx_entry_types_user_active_sort (user_id, is_active, sort_order),
  ADD CONSTRAINT fk_entry_types_user FOREIGN KEY (user_id) REFERENCES users(id);
