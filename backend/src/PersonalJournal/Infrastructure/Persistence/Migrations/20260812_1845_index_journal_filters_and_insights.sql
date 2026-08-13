USE registro_personal;

-- Índices para filtros del historial e insights por usuario.
-- No se modifica ninguna migración previa ya aplicada.

-- Apoya el join con entry_types (filtro por tipo) combinado con fechas.
CREATE INDEX idx_journal_user_type_occurred
  ON journal_entries (user_id, entry_type_id, occurred_at);

-- Filtros y agregados por rango de sensación.
CREATE INDEX idx_journal_user_score
  ON journal_entries (user_id, feeling_score);