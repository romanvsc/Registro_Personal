# Registro Personal

Aplicación Vue 3 + PHP 8 + MySQL para registrar cualquier tipo de momento configurable y asociarle una sensación de 1 a 10.

Arquitectura modular en bounded contexts (`IdentityAccess`, `PersonalJournal`, `PersonalInsights`) siguiendo Clean Architecture + hexagonal (Infrastructure → Application → Domain).

## Requisitos

- Node 18+ y npm
- PHP 8.1+
- MySQL / MariaDB

## Configuración

La conexión a la base de datos se resuelve en orden de prioridad:

1. Variables de entorno `DB_DSN`, `DB_USER`, `DB_PASSWORD` (recomendado en producción).
2. `backend/config.php` (opcional, no versionado).

Para desarrollo local sin variables de entorno, copiar `backend/config.php.example` como `backend/config.php` y ajustar las credenciales. `backend/config.php` está excluido del control de versiones: **nunca subas credenciales reales al repositorio**.

Variables de entorno soportadas:

```text
DB_DSN
DB_USER
DB_PASSWORD
APP_BASE_PATH   (default: /registro_gatos)
CORS_ORIGIN     (vacío = sin cabeceras CORS; se usa el proxy de Vite en desarrollo)
APP_ENV         (production, local, development o test)
APP_URL         (URL pública base usada para construir enlaces de recuperación)
MAIL_FROM       (obligatoria para recuperación en producción)
MAIL_FROM_NAME  (default: Mi registro)
```

Ver `.env.example` como plantilla.

## Base de datos

Importar en phpMyAdmin, en este orden:

1. `backend/src/IdentityAccess/Infrastructure/Persistence/Migrations/20260809_create_users_and_demo.sql`
2. `backend/src/PersonalJournal/Infrastructure/Persistence/Migrations/20260809_create_parameterized_journal.sql`
3. `backend/src/PersonalJournal/Infrastructure/Persistence/Migrations/20260813_scope_entry_types_by_user.sql`
4. `backend/src/IdentityAccess/Infrastructure/Persistence/Migrations/20260814_create_password_reset_tokens.sql`
5. `backend/src/PersonalJournal/Infrastructure/Persistence/Migrations/20260816_convert_journal_to_utf8mb4.sql`

Los `CREATE TABLE IF NOT EXISTS` y los `ON DUPLICATE KEY UPDATE` hacen que las migraciones sean idempotentes.

## Desarrollo

```powershell
npm install
npm run dev
php -S 127.0.0.1:8000 -t backend/public backend/router.php
```

El proxy de Vite reenvía `/registro_gatos/api/*` a `http://127.0.0.1:8000`, por lo que no se necesitan cabeceras CORS en desarrollo.

Para probar recuperación sin correo real, usar `APP_ENV=local` y configurar `APP_URL`. El adaptador local escribe los enlaces en `backend/var/password-reset-links.log`, directorio ignorado por Git. En producción no se registran tokens y se utiliza `mail()` con `MAIL_FROM`/`MAIL_FROM_NAME`; no se incluyen credenciales SMTP en el repositorio.

## API

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/entry-types`
- `GET /api/entries?page=1&limit=30` → `{ items, pagination: { page, limit, total, pages } }` (limit entre 1 y 100, default 30)
- `POST /api/entries` → `{ entry: { ... } }`

## Deploy (Ferozo)

Build reproducible, sin copias manuales versionadas:

1. `npm run build` → genera `dist/`.
2. Subir al directorio del dominio (p. ej. `public_html/registro_gatos/`):
   - el contenido de `dist/` (incluye `assets/`, `cats/`, `icons/`, `auth/`);
   - el directorio `backend/` completo;
   - el archivo `.htaccess` (enruta `/registro_gatos/api/*` hacia `backend/public/index.php` y sirve `index.html` para las rutas de Vue).
3. Crear `backend/config.php` en el servidor desde `backend/config.php.example`, o exportar `DB_DSN`, `DB_USER`, `DB_PASSWORD` vía variables de entorno del hosting.

Las migraciones SQL del punto anterior se importan una sola vez en el nombre de la base de datos de tu hosting (nunca versionar ese nombre: coincide con el usuario MySQL del hosting).

## Seguridad

> **IMPORTANTE:** En versiones anteriores del repositorio se versionaron credenciales reales de la base de datos de producción. Aunque ya se eliminaron del código en rama, **persisten en el historial de Git** y deben considerarse comprometidas:
>
> 1. **Rotar las credenciales** de MySQL en el panel del hosting (usuario y contraseña de la base de datos).
> 2. Actualizar `backend/config.php` o las variables de entorno del servidor con el nuevo valor (sin versionarlo).
> 3. Limpiar el historial de Git con `git filter-repo` (o equivalente) para eliminar los secretos de los commits anteriores.
> 4. Volver a subir el build con las nuevas credenciales.

Reglas aplicadas:

- `backend/config.php`, `.env`, `.env.local`, `deploy/` y `*.local` están en `.gitignore`.
- Se usan prepared statements en todo el acceso a datos (`PDO::ATTR_EMULATE_PREPARES => false`).
- Sesiones PHP con cookie `HttpOnly` y `SameSite=Lax`; `session_regenerate_id(true)` al autenticar.
- No se exponen excepciones internas en las respuestas HTTP.
- No se guarda la sesión en `localStorage`.
