-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-08-2026 a las 02:42:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET SESSION sql_require_primary_key = OFF;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `registro_personal`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entry_types`
--

CREATE TABLE `entry_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `slug` varchar(80) NOT NULL,
  `name` varchar(120) NOT NULL,
  `icon` varchar(80) NOT NULL DEFAULT 'nuevo-registro',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `entry_types`
--

INSERT INTO `entry_types` (`id`, `slug`, `name`, `icon`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'comida', 'Comida', 'comidas', 1, 10, '2026-08-10 00:03:55', '2026-08-10 00:03:55'),
(2, 'entrenamiento', 'Entrenamiento', 'entrenamientos', 1, 20, '2026-08-10 00:03:55', '2026-08-10 00:03:55'),
(3, 'animo', 'Estado de ánimo', 'estado-animo', 1, 30, '2026-08-10 00:03:55', '2026-08-10 00:04:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entry_type_fields`
--

CREATE TABLE `entry_type_fields` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entry_type_id` bigint(20) UNSIGNED NOT NULL,
  `field_key` varchar(80) NOT NULL,
  `label` varchar(120) NOT NULL,
  `input_type` enum('text','textarea','number','date','time','select','checkbox') NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `options_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options_json`)),
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `entry_type_fields`
--

INSERT INTO `entry_type_fields` (`id`, `entry_type_id`, `field_key`, `label`, `input_type`, `is_required`, `options_json`, `sort_order`) VALUES
(1, 1, 'descripcion', '¿Que comiste?', 'textarea', 0, NULL, 10),
(2, 2, 'duracion', '¿Duracion en minutos', 'number', 0, NULL, 10),
(3, 3, 'contexto', '¿Que influye en tu animo?', 'textarea', 0, NULL, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `entry_type_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(180) NOT NULL,
  `notes` text DEFAULT NULL,
  `feeling_score` tinyint(3) UNSIGNED NOT NULL,
  `values_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`values_json`)),
  `occurred_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Volcado de datos para la tabla `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `user_id`, `entry_type_id`, `title`, `notes`, `feeling_score`, `values_json`, `occurred_at`, `created_at`, `updated_at`) VALUES
(3, 1, 3, 'Verificación integrada temporal', NULL, 7, '{\"contexto\":\"prueba\"}', '2026-08-10 02:08:25', '2026-08-10 00:08:25', '2026-08-10 00:08:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `avatar_key` varchar(40) DEFAULT NULL,
  `biography` varchar(500) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `is_active`, `avatar_key`, `biography`, `created_at`, `updated_at`) VALUES
(1, 'Usuario Demo', 'demo@registro.local', '$2y$10$dV2gAYqWsHaF1uTzXe0NH.RlL7cy9e8l38OyVHLAYqgezpoDgSpNG', 1, NULL, '', '2026-08-09 23:08:22', '2026-08-09 23:08:22');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `entry_types`
--
ALTER TABLE `entry_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_entry_types_slug` (`slug`);

--
-- Indices de la tabla `entry_type_fields`
--
ALTER TABLE `entry_type_fields`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_type_field_key` (`entry_type_id`,`field_key`);

--
-- Indices de la tabla `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_journal_user_occurred` (`user_id`,`occurred_at`),
  ADD KEY `idx_journal_type` (`entry_type_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `entry_types`
--
ALTER TABLE `entry_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `entry_type_fields`
--
ALTER TABLE `entry_type_fields`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entry_type_fields`
--
ALTER TABLE `entry_type_fields`
  ADD CONSTRAINT `fk_entry_type_fields_type` FOREIGN KEY (`entry_type_id`) REFERENCES `entry_types` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `fk_journal_type` FOREIGN KEY (`entry_type_id`) REFERENCES `entry_types` (`id`),
  ADD CONSTRAINT `fk_journal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
