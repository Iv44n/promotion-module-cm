# Documentación Detallada del API - Módulo de Promociones

Este documento describe en detalle la arquitectura, componentes y funcionamiento del API del Módulo de Promociones.

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Modelo de Base de Datos](#modelo-de-base-de-datos)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Endpoints de la API](#endpoints-de-la-api)
7. [Motor de Promociones (Rule Engine)](#motor-de-promociones-rule-engine)
8. [Flujos de Datos](#flujos-de-datos)
9. [Patrones de Diseño](#patrones-de-diseño)
10. [Cómo Extender el Sistema](#cómo-extender-el-sistema)

---

## 1. Visión General

El API de Promociones es un sistema backend construido con **NestJS** que permite:

- **Gestionar promociones** (CRUD completo)
- **Evaluar y aplicar promociones** a carritos de compra usando un motor de reglas flexible

El sistema utiliza el **patrón Strategy** para hacer el motor de promociones extensible, permitiendo agregar nuevos tipos de condiciones y acciones sin modificar el código existente.

---

## 2. Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| **NestJS** | Framework backend (Node.js) |
| **Drizzle ORM** | ORM type-safe para PostgreSQL |
| **PostgreSQL** | Base de datos relacional |
| **Zod** | Validación de schemas y DTOs |
| **TypeScript** | Lenguaje de programación |

---

## 3. Arquitectura del Sistema

```mermaid
graph TB
    subgraph "API Layer"
        PC[PromotionsController]
        PEC[PromotionEngineController]
    end

    subgraph "Service Layer"
        PS[PromotionsService]
        PES[PromotionEngineService]
    end

    subgraph "Repository Layer"
        PR[PromotionsRepository]
        PER[PromotionEngineRepository]
    end

    subgraph "Strategy Layer"
        SR[StrategyRegistry]
        CS[ConditionStrategies]
        AS[ActionStrategies]
    end

    subgraph "Database"
        DB[(PostgreSQL)]
    end

    PC --> PS --> PR --> DB
    PEC --> PES --> PER --> DB
    PES --> SR
    SR --> CS
    SR --> AS
```

### Capas del Sistema:

1. **Controller Layer**: Maneja las peticiones HTTP y valida los datos de entrada
2. **Service Layer**: Contiene la lógica de negocio
3. **Repository Layer**: Interactúa con la base de datos usando Drizzle ORM
4. **Strategy Layer**: Implementa el motor de reglas con estrategias intercambiables

---

## 4. Modelo de Base de Datos

### 4.1 Diagrama Entidad-Relación

```mermaid
erDiagram
    promotions ||--o{ promotion_conditions : has
    promotions ||--o{ promotion_actions : has
    promotions }o--|| type_promotions : references

    promotions {
        uuid id PK
        text name
        text description
        integer promotion_type FK
        timestamp start_date
        timestamp end_date
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    promotion_conditions {
        serial id PK
        uuid promotion_id FK
        enum condition_type
        jsonb configuration
    }

    promotion_actions {
        serial id PK
        uuid promotion_id FK
        enum action_type
        jsonb configuration
    }

    type_promotions {
        serial id PK
        text type
        text description
        enum action_type
        enum condition_type
    }
```

### 4.2 Definición de Tablas

#### Tabla `promotions`
Almacena la información principal de cada promoción.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único (auto-generado) |
| `name` | TEXT | Nombre de la promoción |
| `description` | TEXT | Descripción de la promoción |
| `promotion_type` | INTEGER | Referencia al tipo de promoción |
| `start_date` | TIMESTAMP | Fecha de inicio de vigencia |
| `end_date` | TIMESTAMP | Fecha de fin de vigencia |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
| `is_active` | BOOLEAN | Estado activo/inactivo |

**Archivo**: [promotion.entity.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotions/entities/promotion.entity.ts)

---

#### Tabla `promotion_conditions`
Define las condiciones que deben cumplirse para aplicar una promoción.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Identificador único |
| `promotion_id` | UUID | FK a la promoción (CASCADE DELETE) |
| `condition_type` | ENUM | Tipo de condición |
| `configuration` | JSONB | Configuración específica de la condición |

**Tipos de condición disponibles:**
- `TARGET_CATEGORY`: Productos de una categoría específica
- `MIN_AMOUNT`: Monto mínimo de compra

**Archivo**: [promotion-rules.entity.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotions/entities/promotion-rules.entity.ts)

---

#### Tabla `promotion_actions`
Define las acciones a ejecutar cuando se cumplen las condiciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Identificador único |
| `promotion_id` | UUID | FK a la promoción (CASCADE DELETE) |
| `action_type` | ENUM | Tipo de acción |
| `configuration` | JSONB | Configuración específica de la acción |

**Tipos de acción disponibles:**
- `PERCENTAGE_DISCOUNT`: Descuento porcentual
- `FIXED_DISCOUNT`: Descuento de monto fijo

**Archivo**: [promotion-rules.entity.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotions/entities/promotion-rules.entity.ts)

---

## 5. Módulos del Sistema

### 5.1 AppModule (Módulo Principal)

**Archivo**: [app.module.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/app.module.ts)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PromotionsModule,
    PromotionEngineModule,
  ],
})
export class AppModule {}
```

El módulo principal importa:
- **ConfigModule**: Configuración global de variables de entorno
- **PromotionsModule**: Gestión CRUD de promociones
- **PromotionEngineModule**: Motor de evaluación de promociones

---

### 5.2 PromotionsModule

**Archivo**: [promotions.module.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotions/promotions.module.ts)

**Responsabilidad**: Gestión CRUD de promociones

| Componente | Responsabilidad |
|------------|-----------------|
| `PromotionsController` | Endpoints REST para promociones |
| `PromotionsService` | Lógica de negocio de promociones |
| `PromotionsRepository` | Acceso a datos (Drizzle ORM) |
| `MetadataController` | Endpoints para metadatos |
| `MetadataService` | Servicio de metadatos |

---

### 5.3 PromotionEngineModule

**Archivo**: [promotion-engine.module.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/promotion-engine.module.ts)

**Responsabilidad**: Evaluación y aplicación de promociones

| Componente | Responsabilidad |
|------------|-----------------|
| `PromotionEngineController` | Endpoint de checkout |
| `PromotionEngineService` | Lógica del motor de reglas |
| `PromotionEngineRepository` | Consulta de promociones activas |
| `StrategyRegistry` | Registro de estrategias |

---

### 5.4 DrizzleModule

**Archivo**: [drizzle.provider.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/database/drizzle.provider.ts)

**Responsabilidad**: Conexión a PostgreSQL usando Drizzle ORM

```typescript
export const DrizzleAsyncProvider = {
  provide: DRIZZLE_TOKEN,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const databaseUrl = config.get<string>('DATABASE_URL');
    const pool = new Pool({ connectionString: databaseUrl });
    return drizzle(pool, { schema });
  },
};
```

---

## 6. Endpoints de la API

### 6.1 Promociones CRUD

**Base URL**: `/api/promotions`

#### GET /api/promotions
**Descripción**: Obtiene todas las promociones

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "isActive": true,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z"
  }
]
```

---

#### POST /api/promotions
**Descripción**: Crea una nueva promoción

**Request Body**:
```json
{
  "name": "Descuento 10% en Electrónicos",
  "description": "10% de descuento en productos de electrónica",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true,
  "condition": {
    "conditionType": "TARGET_CATEGORY",
    "configuration": {
      "categoryId": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "action": {
    "actionType": "PERCENTAGE_DISCOUNT",
    "configuration": {
      "discountPercentage": 10
    }
  }
}
```

**Response**:
```json
{
  "id": "uuid-generado",
  "name": "Descuento 10% en Electrónicos",
  "description": "10% de descuento en productos de electrónica",
  "isActive": true,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z"
}
```

---

#### DELETE /api/promotions/:promotionId
**Descripción**: Elimina una promoción

**Response**:
```json
{
  "message": "Promotion with id uuid was deleted successfully"
}
```

---

#### PATCH /api/promotions/:promotionId
**Descripción**: Actualiza una promoción

**Request Body** (campos opcionales):
```json
{
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "isActive": false
}
```

**Response**:
```json
{
  "message": "Promotion with id uuid was updated successfully"
}
```

---

### 6.2 Motor de Promociones

**Base URL**: `/api/promotion-engine`

#### POST /api/promotion-engine/checkout
**Descripción**: Aplica una promoción a un carrito de compras

**Request Body**:
```json
{
  "promotionId": "550e8400-e29b-41d4-a716-446655440000",
  "cart": {
    "totalAmount": 1000.00,
    "items": [
      {
        "productId": "prod-uuid-1",
        "categoryId": "cat-uuid-1",
        "quantity": 2,
        "price": 500.00
      }
    ]
  }
}
```

**Response (Promoción aplicada)**:
```json
{
  "status": "APPLIED",
  "promotionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "10% discount applied",
  "originalAmount": 1000.00,
  "finalAmount": 900.00,
  "discount": 100.00
}
```

**Response (Promoción no aplicable)**:
```json
{
  "status": "NOT_APPLICABLE",
  "promotionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Condition not met",
  "originalAmount": 1000.00,
  "finalAmount": 1000.00,
  "discount": 0
}
```

---

## 7. Motor de Promociones (Rule Engine)

### 7.1 Concepto

El Motor de Promociones es un **sistema de reglas** que evalúa si un carrito de compras cumple con las condiciones de una promoción y, de ser así, aplica la acción correspondiente (descuento).

### 7.2 Diagrama de Flujo

```mermaid
flowchart TD
    A[POST /checkout] --> B[Obtener promoción activa]
    B --> C{¿Promoción existe?}
    C -->|No| D[Error: Promoción no encontrada]
    C -->|Sí| E[Parsear condición con Zod]
    E --> F{¿Condición válida?}
    F -->|No| G[Return: NOT_APPLICABLE]
    F -->|Sí| H[Obtener ConditionStrategy]
    H --> I[Ejecutar validate]
    I --> J{¿Condición cumplida?}
    J -->|No| G
    J -->|Sí| K[Parsear acción con Zod]
    K --> L[Obtener ActionStrategy]
    L --> M[Ejecutar apply]
    M --> N[Return: APPLIED + descuento]
```

### 7.3 Componentes del Motor

#### StrategyRegistry

**Archivo**: [strategy.registry.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/strategies/strategy.registry.ts)

El `StrategyRegistry` es un servicio que:
1. Registra estrategias de condiciones y acciones
2. Proporciona métodos para obtener la estrategia correcta según el tipo

```typescript
@Injectable()
export class StrategyRegistry {
  private conditionStrategies: Map<PromotionConditionType, PromotionConditionStrategy>;
  private actionStrategies: Map<PromotionActionType, PromotionActionStrategy>;

  constructor() {
    this.registerConditionStrategy(new TargetCategoryStrategy());
    this.registerConditionStrategy(new MinAmountStrategy());
    this.registerActionStrategy(new PercentageDiscountStrategy());
  }
}
```

---

### 7.4 Estrategias de Condición

#### Interface Base

**Archivo**: [base-condition.strategy.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/strategies/conditions/base-condition.strategy.ts)

```typescript
export interface PromotionConditionStrategy {
  readonly type: PromotionConditionType;
  validate(cart: CartDto, promotionCondition: Condition): boolean;
}
```

---

#### TargetCategoryStrategy

**Archivo**: [target-category.strategy.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/strategies/conditions/target-category.strategy.ts)

**Propósito**: Valida si el carrito contiene productos de una categoría específica

**Configuración**:
```json
{
  "conditionType": "TARGET_CATEGORY",
  "configuration": {
    "categoryId": "uuid-de-categoria"
  }
}
```

**Lógica**:
```typescript
validate(cart: CartDto, promotionCondition: TargetCategoryCondition): boolean {
  const { items } = cart;
  const { categoryId } = promotionCondition.configuration;
  return items.some((item) => item.categoryId === categoryId);
}
```

---

#### MinAmountStrategy

**Archivo**: [min-amount.strategy.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/strategies/conditions/min-amount.strategy.ts)

**Propósito**: Valida si el monto total del carrito supera un mínimo

**Configuración**:
```json
{
  "conditionType": "MIN_AMOUNT",
  "configuration": {
    "amount": 100.00
  }
}
```

**Lógica**:
```typescript
validate(cart: CartDto, condition: MinAmountCondition): boolean {
  const { amount } = condition.configuration;
  return cart.totalAmount >= amount;
}
```

---

### 7.5 Estrategias de Acción

#### Interface Base

**Archivo**: [base-action.strategy.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/strategies/actions/base-action.strategy.ts)

```typescript
export interface PromotionActionStrategy {
  readonly type: PromotionActionType;
  apply(cart: CartDto, promotionAction: Action): {
    message: string;
    finalAmount: number;
    discount: number;
  };
}
```

---

#### PercentageDiscountStrategy

**Archivo**: [percentage-discount.strategy.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/strategies/actions/percentage-discount.strategy.ts)

**Propósito**: Aplica un descuento porcentual al total del carrito

**Configuración**:
```json
{
  "actionType": "PERCENTAGE_DISCOUNT",
  "configuration": {
    "discountPercentage": 10
  }
}
```

**Lógica**:
```typescript
apply(cart: CartDto, promotionAction: PercentageDiscountAction) {
  const { discountPercentage } = promotionAction.configuration;
  const discount = cart.totalAmount * (discountPercentage / 100);
  const finalAmount = cart.totalAmount - discount;

  return {
    message: `${discountPercentage}% discount applied`,
    finalAmount,
    discount,
  };
}
```

---

## 8. Flujos de Datos

### 8.1 Flujo de Creación de Promoción

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Repository
    participant Database

    Client->>Controller: POST /api/promotions
    Controller->>Controller: Validar DTO con Zod
    Controller->>Service: createPromotion(dto)
    Service->>Repository: createPromotion(dto)
    Repository->>Database: BEGIN TRANSACTION
    Repository->>Database: INSERT promotions
    Repository->>Database: INSERT promotion_conditions
    Repository->>Database: INSERT promotion_actions
    Repository->>Database: COMMIT
    Database-->>Repository: Promoción creada
    Repository-->>Service: PromotionResponseDTO
    Service-->>Controller: PromotionResponseDTO
    Controller-->>Client: 201 Created
```

### 8.2 Flujo de Aplicación de Promoción

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Repository
    participant StrategyRegistry
    participant ConditionStrategy
    participant ActionStrategy

    Client->>Controller: POST /api/promotion-engine/checkout
    Controller->>Controller: Validar DTO con Zod
    Controller->>Service: applyPromotions(dto)
    Service->>Repository: getActivePromotionById(id)
    Repository-->>Service: Promoción con condiciones y acciones
    Service->>StrategyRegistry: getConditionStrategy(type)
    StrategyRegistry-->>Service: ConditionStrategy
    Service->>ConditionStrategy: validate(cart, condition)
    ConditionStrategy-->>Service: true/false
    alt Condición cumplida
        Service->>StrategyRegistry: getActionStrategy(type)
        StrategyRegistry-->>Service: ActionStrategy
        Service->>ActionStrategy: apply(cart, action)
        ActionStrategy-->>Service: {finalAmount, discount}
        Service-->>Controller: {status: "APPLIED", ...}
    else Condición no cumplida
        Service-->>Controller: {status: "NOT_APPLICABLE", ...}
    end
    Controller-->>Client: Response
```

---

## 9. Patrones de Diseño

### 9.1 Strategy Pattern

El sistema utiliza el **patrón Strategy** para las condiciones y acciones de las promociones:

```mermaid
classDiagram
    class PromotionConditionStrategy {
        <<interface>>
        +type: PromotionConditionType
        +validate(cart, condition): boolean
    }

    class TargetCategoryStrategy {
        +type: "TARGET_CATEGORY"
        +validate(cart, condition): boolean
    }

    class MinAmountStrategy {
        +type: "MIN_AMOUNT"
        +validate(cart, condition): boolean
    }

    class StrategyRegistry {
        -conditionStrategies: Map
        -actionStrategies: Map
        +registerConditionStrategy(strategy)
        +getConditionStrategy(type)
    }

    PromotionConditionStrategy <|.. TargetCategoryStrategy
    PromotionConditionStrategy <|.. MinAmountStrategy
    StrategyRegistry --> PromotionConditionStrategy
```

**Ventajas**:
- **Extensibilidad**: Agregar nuevas estrategias sin modificar código existente
- **Separación de responsabilidades**: Cada estrategia tiene una sola responsabilidad
- **Testabilidad**: Las estrategias pueden probarse de forma aislada

---

### 9.2 Repository Pattern

El sistema utiliza el **patrón Repository** para abstraer el acceso a datos:

- `PromotionsRepository`: Gestiona operaciones CRUD de promociones
- `PromotionEngineRepository`: Consulta promociones activas con sus reglas

---

### 9.3 Dependency Injection

NestJS proporciona **inyección de dependencias** automática:

```typescript
@Injectable()
export class PromotionEngineService {
  constructor(
    private readonly promotionEngineRepository: PromotionEngineRepository,
    private readonly strategyRegistry: StrategyRegistry,
  ) {}
}
```

---

## 10. Cómo Extender el Sistema

### 10.1 Agregar Nueva Condición

1. **Agregar el tipo al enum** en [promotion-metadatas.entity.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotions/entities/promotion-metadatas.entity.ts):

```typescript
export const promotionConditionsTypesEnum = pgEnum(
  'promotion_conditions_types',
  ['TARGET_CATEGORY', 'MIN_AMOUNT', 'NEW_CONDITION'], // Agregar aquí
);
```

2. **Definir el schema Zod** en [conditions.ts](file:///home/jairgz/Escritorio/promotion-module-cm/api/src/modules/promotion-engine/rules/conditions.ts):

```typescript
export const newConditionSchema = z.object({
  conditionType: z.literal('NEW_CONDITION'),
  configuration: z.object({
    // Campos específicos de la condición
  }),
});

export const conditionSchema = z.discriminatedUnion('conditionType', [
  targetCategoryConditionSchema,
  minAmountConditionSchema,
  newConditionSchema, // Agregar aquí
]);
```

3. **Crear la estrategia** en `strategies/conditions/`:

```typescript
export class NewConditionStrategy implements PromotionConditionStrategy {
  readonly type: PromotionConditionType = 'NEW_CONDITION';

  validate(cart: CartDto, condition: NewCondition): boolean {
    // Implementar lógica de validación
    return true;
  }
}
```

4. **Registrar en el StrategyRegistry**:

```typescript
constructor() {
  this.registerConditionStrategy(new TargetCategoryStrategy());
  this.registerConditionStrategy(new MinAmountStrategy());
  this.registerConditionStrategy(new NewConditionStrategy()); // Agregar aquí
}
```

5. **Ejecutar migración de base de datos** para actualizar el enum.

---

### 10.2 Agregar Nueva Acción

Sigue el mismo proceso pero para las acciones:

1. Agregar tipo a `promotionActionsTypesEnum`
2. Definir schema Zod en `actions.ts`
3. Crear estrategia implementando `PromotionActionStrategy`
4. Registrar en `StrategyRegistry`

---

## 📁 Estructura de Archivos del API

```
api/src/
├── app.module.ts                    # Módulo principal
├── main.ts                          # Entry point
├── common/
│   └── filters/                     # Filtros de excepciones
├── database/
│   ├── drizzle.module.ts           # Módulo de Drizzle
│   ├── drizzle.provider.ts         # Provider de conexión
│   └── drizzle.schema.ts           # Schema exportado
└── modules/
    ├── promotions/
    │   ├── promotions.module.ts
    │   ├── promotions.controller.ts
    │   ├── promotions.service.ts
    │   ├── promotions.repository.ts
    │   ├── dto/
    │   │   ├── request/
    │   │   │   ├── create-promotion.dto.ts
    │   │   │   └── update-promotion.dto.ts
    │   │   └── response/
    │   │       └── promotion-response.dto.ts
    │   ├── entities/
    │   │   ├── promotion.entity.ts
    │   │   ├── promotion-rules.entity.ts
    │   │   └── promotion-metadatas.entity.ts
    │   └── metadata/
    │       ├── metadata.controller.ts
    │       └── metadata.service.ts
    └── promotion-engine/
        ├── promotion-engine.module.ts
        ├── promotion-engine.controller.ts
        ├── promotion-engine.service.ts
        ├── promotion-engine.repository.ts
        ├── dto/
        │   ├── request/
        │   │   └── apply-promotion.dto.ts
        │   └── response/
        │       └── apply-promotion-result.dto.ts
        ├── rules/
        │   ├── index.ts
        │   ├── conditions.ts
        │   └── actions.ts
        └── strategies/
            ├── strategy.registry.ts
            ├── conditions/
            │   ├── base-condition.strategy.ts
            │   ├── target-category.strategy.ts
            │   └── min-amount.strategy.ts
            └── actions/
                ├── base-action.strategy.ts
                └── percentage-discount.strategy.ts
```

---

## 🔧 Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/promotions_db
PORT=3000
```

---

## 🚀 Comandos de Ejecución

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar migraciones de Drizzle
npx drizzle-kit push

# Generar migraciones
npx drizzle-kit generate
```