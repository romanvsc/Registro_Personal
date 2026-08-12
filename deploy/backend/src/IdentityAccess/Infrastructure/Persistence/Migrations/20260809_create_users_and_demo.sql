CREATE DATABASE IF NOT EXISTS registro_personal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE registro_personal;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

INSERT INTO users (name, email, password_hash, is_active)
VALUES (
  'Usuario Demo',
  'demo@registro.local',
  '$2y$10$LFN3sRsuSDqLck7ShHh3Zu0bvHupeKpfObW91k0NyFR6IIrVE4CNu',
  1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  is_active = VALUES(is_active);
