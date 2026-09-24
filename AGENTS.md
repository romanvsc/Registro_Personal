# Instrucciones obligatorias para agentes

Estas reglas se aplican a todo agente humano o de IA que analice, diseñe o modifique este repositorio. Su incumplimiento bloquea la aceptación del cambio.

## 1. Skill arquitectónica obligatoria

Antes de diseñar o modificar dominio, casos de uso, API, persistencia o integraciones, el agente DEBE:

1. Leer completamente la skill `clean-ddd-hexagonal` disponible en:
   `C:/Users/roman/.agents/skills/clean-ddd-hexagonal/SKILL.md`.
2. Declarar en su actualización de trabajo que está utilizando esa skill.
3. Aplicar sus reglas de DDD, Clean Architecture y arquitectura hexagonal.
4. Informar en la entrega final cómo influyó la skill en la solución.

No se permite reemplazar esta skill por una interpretación informal de DDD.

## 1.1. Skill UI/UX obligatoria

Antes de diseñar, revisar o modificar cualquier interfaz, experiencia de usuario, componente visual, layout, tipografía, color, responsive o animación, el agente DEBE:

1. Leer completamente la skill `ui-ux-pro-max` disponible en:
   `C:/Users/roman/.codex/skills/ui-ux-pro-max/SKILL.md`.
2. Declarar en su actualización de trabajo que está utilizando esa skill y el bounded context de presentación afectado.
3. Detectar el stack real del proyecto antes de consultar recomendaciones. Para este repositorio, el stack principal es Vue/Vite.
4. Usar el buscador local de la skill con el modo más pequeño que corresponda:
   - `--design-system` para una dirección visual de producto o sistema completo.
   - `--domain` para una preocupación concreta de UX, accesibilidad, color, tipografía, iconos, movimiento o charts.
   - `--stack vue` para recomendaciones específicas de implementación.
5. Verificar antes de entregar: contraste, foco y teclado, objetivos táctiles, reflow sin scroll horizontal, zoom, estados de carga/error y `prefers-reduced-motion`.
6. Tratar los resultados de la skill como recomendaciones subordinadas a estas reglas, a la arquitectura del repositorio y a la solicitud explícita del usuario. No persistir un nuevo design system ni introducir dependencias visuales sin autorización.

La skill se aplica a cambios en `src/styles.css`, `src/App.vue`, `src/shared/`, vistas, componentes y cualquier otro archivo que cambie cómo se ve, se siente o se usa la aplicación. No amplía el alcance hacia backend, dominio, persistencia o APIs.

## 2. Un bounded context por agente

Cada agente DEBE trabajar dentro de un único bounded context durante una tarea.

- Antes de editar, debe declarar el bounded context asignado y el alcance concreto.
- No puede modificar dominio, aplicación, infraestructura ni pruebas pertenecientes a otro bounded context.
- No puede compartir entidades, value objects, repositorios ni modelos de persistencia entre contexts.
- La comunicación entre contexts debe realizarse mediante contratos explícitos: IDs, DTOs, eventos o puertos públicos.
- Si descubre trabajo necesario en otro context, debe detener esa parte, documentarla y solicitar un traspaso o asignarla a otro agente.
- Un cambio que abarque varios contexts debe dividirse en subtareas, una por agente/context, con contratos acordados antes de implementar.
- Ningún agente puede asumir simultáneamente dos contexts, aunque el cambio parezca pequeño.

### Formato obligatorio al comenzar

Todo agente debe indicar:

```text
Bounded context: <nombre>
Objetivo: <resultado concreto>
Archivos permitidos: <rutas>
Contrato con otros contexts: <ninguno o contrato explícito>
Skill aplicada: clean-ddd-hexagonal
```

## 3. Bounded contexts iniciales

La primera propuesta de contextos del producto es:

| Bounded context | Responsabilidad | Conceptos propios |
| --- | --- | --- |
| `IdentityAccess` | Usuarios, autenticación, autorización y sesiones | `User`, `Credential`, `Session` |
| `NutritionJournal` | Registro de comidas y sensaciones asociadas | `MealEntry`, `MealType`, `FeelingScore` |
| `TrainingJournal` | Registro de entrenamientos y sensaciones asociadas | `TrainingEntry`, `Exercise`, `Duration`, `FeelingScore` |
| `MoodJournal` | Registro diario del estado de ánimo | `MoodEntry`, `MoodNote`, `FeelingScore` |
| `PersonalInsights` | Consultas, historial y evolución combinada | Proyecciones de lectura; nunca agregados ajenos |

Esta tabla es un mapa inicial, no una autorización para acoplar contexts. Un context nuevo o un cambio de límites requiere una decisión arquitectónica documentada.

`FeelingScore` puede tener la misma semántica conceptual en varios contexts, pero cada context conserva su propia implementación. Sólo se comparte un contrato estable si existe una decisión explícita que lo justifique.

## 4. Reglas de arquitectura

La dirección de dependencias es obligatoria:

```text
Infrastructure -> Application -> Domain
```

- `Domain` contiene reglas de negocio puras y no importa PHP HTTP, PDO, SQLite, Vue, almacenamiento ni frameworks.
- `Application` contiene casos de uso y coordina el dominio mediante puertos.
- `Infrastructure` implementa adaptadores HTTP, persistencia, autenticación e integraciones.
- Los controladores no acceden directamente a repositorios: invocan casos de uso.
- Los repositorios se definen por aggregate root, nunca por tabla ni por cada entidad.
- Las interfaces de repositorio viven junto al agregado de dominio, salvo que una decisión arquitectónica documentada establezca otra convención para todo el proyecto.
- Un aggregate sólo referencia otro aggregate mediante su ID.
- Una transacción modifica un único aggregate. La coordinación entre aggregates utiliza eventos de dominio cuando corresponda.
- CQRS, Event Sourcing, buses de eventos y microservicios no se agregan por defecto. Requieren una necesidad demostrable.

## 5. Organización esperada por context

El backend debe evolucionar hacia una estructura equivalente a:

```text
backend/src/<BoundedContext>/
  Domain/
    <Aggregate>/
      Entity/
      ValueObject/
      Event/
      Repository/
    Shared/
  Application/
    <UseCase>/
    Port/
  Infrastructure/
    Http/
    Persistence/
    Config/
```

El frontend debe respetar los mismos límites funcionales:

```text
src/contexts/<bounded-context>/
  components/
  views/
  application/
  infrastructure/
```

Los elementos puramente visuales y sin reglas de negocio pueden vivir en `src/shared/`. `shared` no debe convertirse en un dominio común ni contener lógica específica de un context.

## 6. Lenguaje ubicuo y reglas actuales

- `FeelingScore`: puntuación entera entre 1 y 10.
- De 1 a 3 se representa con Felipa.
- De 4 a 7 se representa con Felicia.
- De 8 a 10 se representa con Dorito.
- Una comida, un entrenamiento y un estado de ánimo son conceptos de contexts distintos, aunque compartan una representación visual.
- Las imágenes de los gatos son presentación; no deben formar parte de las entidades de dominio.

Los nombres del dominio deben expresar comportamiento y lenguaje del negocio. Se deben evitar modelos anémicos que sólo contengan datos y setters.

## 7. Flujo obligatorio de implementación

1. Confirmar el bounded context asignado.
2. Identificar reglas, aggregate root, entidades y value objects.
3. Implementar y probar el dominio sin base de datos, HTTP ni UI.
4. Definir los puertos requeridos.
5. Implementar los casos de uso de aplicación.
6. Incorporar adaptadores de infraestructura al final.
7. Verificar que ninguna dependencia apunte hacia afuera.
8. Ejecutar pruebas y build relevantes.

## 8. Criterios de entrega

La entrega final debe incluir:

- Bounded context trabajado.
- Archivos modificados.
- Aggregate y caso de uso afectados.
- Puertos y adaptadores agregados o modificados.
- Pruebas ejecutadas y resultado.
- Confirmación de que se utilizó `clean-ddd-hexagonal`.
- Cualquier contrato o trabajo pendiente perteneciente a otro context.

No se considera terminado un cambio que mezcle responsabilidades entre contexts, introduzca dependencias hacia afuera o eluda un caso de uso desde un controlador.

## 9. Versionado de lanzamientos

El proyecto utiliza obligatoriamente versiones con el formato `MAYOR.MEDIANA.MENOR` (`x.x.x`):

- `MAYOR` se incrementa para cambios mayores. Al hacerlo, `MEDIANA` y `MENOR` se reinician a `0`.
- `MEDIANA` se incrementa para cambios medianos. Al hacerlo, `MENOR` se reinicia a `0`.
- `MENOR` se incrementa para cambios menores.
- La versión inicial de lanzamiento es `1.0.0`.

Todo commit y todo lanzamiento deben indicar explícitamente la versión de lanzamiento a la que pertenecen. La versión visible en la aplicación debe coincidir con esa versión de lanzamiento.
