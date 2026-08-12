# Registro Personal

Aplicación Vue + PHP 8 + MySQL para registrar cualquier tipo de momento configurable y asociarle una sensación de 1 a 10.

## Base de datos

Importar en phpMyAdmin, en este orden:

1. `backend/src/IdentityAccess/Infrastructure/Persistence/Migrations/20260809_create_users_and_demo.sql`
2. `backend/src/PersonalJournal/Infrastructure/Persistence/Migrations/20260809_create_parameterized_journal.sql`

La conexión predeterminada usa MySQL en `127.0.0.1:3306`, usuario `root` y contraseña vacía. Para otra configuración, copiar `backend/config.php.example` como `backend/config.php` y ajustar las credenciales.

## Desarrollo

```powershell
npm install
npm run dev
php -S 127.0.0.1:8000 -t backend/public backend/router.php
```

API:

- `GET /api/health`
- `GET /api/entry-types`
- `GET /api/entries`
- `POST /api/entries`

Los registros se guardan exclusivamente en MySQL. Los tipos y sus campos se administran mediante `entry_types` y `entry_type_fields`.
