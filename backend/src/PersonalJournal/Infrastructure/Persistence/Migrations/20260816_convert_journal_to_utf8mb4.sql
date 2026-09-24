-- Normaliza las tablas del bounded context PersonalJournal sin tocar datos.
-- Ejecutar con la base de datos de destino ya seleccionada.
ALTER TABLE entry_types
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE entry_type_fields
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE journal_entries
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
