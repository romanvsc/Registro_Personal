USE registro_personal;

CREATE TABLE IF NOT EXISTS entry_types (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  icon VARCHAR(80) NOT NULL DEFAULT 'nuevo-registro',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_entry_types_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS entry_type_fields (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entry_type_id BIGINT UNSIGNED NOT NULL,
  field_key VARCHAR(80) NOT NULL,
  label VARCHAR(120) NOT NULL,
  input_type ENUM('text','textarea','number','date','time','select','checkbox') NOT NULL,
  is_required TINYINT(1) NOT NULL DEFAULT 0,
  options_json JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_type_field_key (entry_type_id, field_key),
  CONSTRAINT fk_entry_type_fields_type FOREIGN KEY (entry_type_id) REFERENCES entry_types(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS journal_entries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  entry_type_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  notes TEXT NULL,
  feeling_score TINYINT UNSIGNED NOT NULL,
  values_json JSON NOT NULL,
  occurred_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_journal_user_occurred (user_id, occurred_at),
  KEY idx_journal_type (entry_type_id),
  CONSTRAINT chk_journal_feeling_score CHECK (feeling_score BETWEEN 1 AND 10),
  CONSTRAINT fk_journal_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_journal_type FOREIGN KEY (entry_type_id) REFERENCES entry_types(id)
) ENGINE=InnoDB;

INSERT INTO entry_types (slug, name, icon, sort_order) VALUES
  ('comida', 'Comida', 'comidas', 10),
  ('entrenamiento', 'Entrenamiento', 'entrenamientos', 20),
  ('animo', 'Estado de ánimo', 'estado-animo', 30)
ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon), sort_order = VALUES(sort_order);

INSERT INTO entry_type_fields (entry_type_id, field_key, label, input_type, is_required, options_json, sort_order)
SELECT id, 'descripcion', '¿Qué comiste?', 'textarea', 0, NULL, 10 FROM entry_types WHERE slug = 'comida'
ON DUPLICATE KEY UPDATE label = VALUES(label), input_type = VALUES(input_type);

INSERT INTO entry_type_fields (entry_type_id, field_key, label, input_type, is_required, options_json, sort_order)
SELECT id, 'duracion', 'Duración en minutos', 'number', 0, NULL, 10 FROM entry_types WHERE slug = 'entrenamiento'
ON DUPLICATE KEY UPDATE label = VALUES(label), input_type = VALUES(input_type);

INSERT INTO entry_type_fields (entry_type_id, field_key, label, input_type, is_required, options_json, sort_order)
SELECT id, 'contexto', '¿Qué influyó en tu ánimo?', 'textarea', 0, NULL, 10 FROM entry_types WHERE slug = 'animo'
ON DUPLICATE KEY UPDATE label = VALUES(label), input_type = VALUES(input_type);
