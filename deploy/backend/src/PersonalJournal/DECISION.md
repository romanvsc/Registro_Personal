# PersonalJournal parametrizable

## Decisión

Los registros de comida, entrenamiento y ánimo se modelan como configuraciones del bounded context `PersonalJournal`, en vez de mantener tres agregados con persistencia duplicada.

`EntryType` define el nombre, icono y campos configurables. `JournalEntry` es el aggregate root que conserva usuario, tipo, título, notas, puntuación, valores y fecha. El contrato con `IdentityAccess` es exclusivamente `userId`; `PersonalInsights` consume DTOs de lectura de la API.

Los nuevos tipos y campos se parametrizan en `entry_types` y `entry_type_fields`. No requieren cambios en PHP ni Vue. No se incorporan CQRS, eventos ni un bus porque el flujo actual no los necesita.
