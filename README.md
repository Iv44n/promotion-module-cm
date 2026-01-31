# Promotion Module CM

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Sistema modular de gestión de promociones con motor de reglas dinámico**

</div>

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Modelo de Datos](#modelo-de-datos)
- [Motor de Promociones](#motor-de-promociones)
- [Instalación y Configuración](#instalación-y-configuración)
- [API Reference](#api-reference)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## Descripción General

**Promotion Module CM** es un sistema completo para la gestión de promociones comerciales que incluye:

- **Backend API** con motor de reglas basado en el patrón Strategy
- **Frontend Web** para administración de promociones
- **Aplicación Móvil** Android para punto de venta

El sistema permite crear, configurar y aplicar promociones dinámicas con condiciones y acciones personalizables, ideal para comercios que necesitan flexibilidad en sus estrategias promocionales.

---

## Arquitectura del Proyecto

```
promotion-module-cm/
├── api/                    # Backend NestJS
├── web/                    # Frontend React (Vite)
└── mobile/                 # App Android (Kotlin + Compose)
```

### Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Frontend"
        WEB[Web App<br/>React + Vite]
        MOBILE[Mobile App<br/>Kotlin + Compose]
    end
    
    subgraph "Backend API"
        CONTROLLER[Controllers]
        SERVICE[Services]
        ENGINE[Promotion Engine]
        REPO[Repositories]
    end
    
    subgraph "Database"
        PG[(PostgreSQL)]
    end
    
    WEB --> CONTROLLER
    MOBILE --> CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> ENGINE
    SERVICE --> REPO
    ENGINE --> REPO
    REPO --> PG
```

---

## Tecnologías

### Backend (API)

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **NestJS** | 11.x | Framework backend modular |
| **Drizzle ORM** | 0.45.x | ORM TypeScript-first |
| **PostgreSQL** | 8.x | Base de datos relacional |
| **Zod** | 4.x | Validación de esquemas |
| **TypeScript** | 5.7.x | Tipado estático |

### Frontend (Web)

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 18.x | Biblioteca UI |
| **Vite** | 5.x | Build tool moderno |
| **TailwindCSS** | 3.x | Framework CSS utility-first |
| **shadcn/ui** | - | Componentes accesibles |
| **React Query** | 5.x | Estado del servidor |
| **Zustand** | 5.x | Gestión de estado |
| **React Hook Form** | 7.x | Formularios |
| **Zod** | 3.x | Validación |

### Mobile (Android)

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Kotlin** | - | Lenguaje principal |
| **Jetpack Compose** | BOM | UI declarativa |
| **Material3** | - | Design system |
| **Gradle** | Kotlin DSL | Sistema de build |

---

## Modelo de Datos

### Diagrama Entidad-Relación

```mermaid
erDiagram
    PROMOTIONS {
        uuid id PK
        text name
        text description
        int promotion_type FK
        timestamp start_date
        timestamp end_date
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }
    
    TYPE_PROMOTIONS {
        serial id PK
        text type
        text description
        enum action_type
        enum condition_type
    }
    
    PROMOTION_CONDITIONS {
        serial id PK
        uuid promotion_id FK
        enum condition_type
        jsonb configuration
    }
    
    PROMOTION_ACTIONS {
        serial id PK
        uuid promotion_id FK
        enum action_type
        jsonb configuration
    }
    
    TYPE_PROMOTIONS ||--o{ PROMOTIONS : "defines"
    PROMOTIONS ||--|| PROMOTION_CONDITIONS : "has"
    PROMOTIONS ||--|| PROMOTION_ACTIONS : "has"
```

### Tipos de Condiciones

| Tipo | Descripción | Configuración |
|------|-------------|---------------|
| `TARGET_CATEGORY` | Aplica a productos de una categoría específica | `{ categoryId: UUID }` |
| `MIN_AMOUNT` | Requiere un monto mínimo de compra | `{ minAmount: number }` |

### Tipos de Acciones

| Tipo | Descripción | Configuración |
|------|-------------|---------------|
| `PERCENTAGE_DISCOUNT` | Descuento porcentual | `{ percentage: number }` |
| `FIXED_DISCOUNT` | Descuento fijo en monto | `{ amount: number }` |

---

## Motor de Promociones

El **Promotion Engine** es el corazón del sistema, implementado con el **patrón Strategy** para máxima flexibilidad y extensibilidad.

### Arquitectura del Engine

```mermaid
flowchart LR
    subgraph Input
        CART[Cart DTO]
        PROMO_ID[Promotion ID]
    end
    
    subgraph Engine["Promotion Engine Service"]
        FETCH[Fetch Promotion]
        VALIDATE[Validate Conditions]
        APPLY[Apply Actions]
    end
    
    subgraph Strategies
        COND_REG[Condition Strategies]
        ACT_REG[Action Strategies]
    end
    
    subgraph Output
        RESULT[Apply Result DTO]
    end
    
    CART --> FETCH
    PROMO_ID --> FETCH
    FETCH --> VALIDATE
    VALIDATE --> COND_REG
    COND_REG --> APPLY
    APPLY --> ACT_REG
    ACT_REG --> RESULT
```

### Flujo de Evaluación

1. **Recepción**: Se recibe el carrito y el ID de promoción
2. **Obtención**: Se recupera la promoción activa de la base de datos
3. **Validación de Condición**: Se evalúa si el carrito cumple la condición
4. **Aplicación de Acción**: Si la condición se cumple, se aplica el descuento
5. **Respuesta**: Se devuelve el resultado con el descuento aplicado

### Estructura de DTOs

#### Cart DTO (Entrada)

```typescript
interface CartDto {
  totalAmount: number;      // Monto total del carrito
  items: CartItem[];        // Productos del carrito
}

interface CartItem {
  productId: string;        // UUID del producto
  categoryId: string;       // UUID de la categoría
  quantity: number;         // Cantidad
  price: number;            // Precio unitario
}
```

#### Apply Promotion Result DTO (Salida)

```typescript
interface ApplyPromotionResultDto {
  status: 'APPLIED' | 'NOT_APPLICABLE';  // Estado de la aplicación
  promotionId: string;                    // UUID de la promoción
  message: string;                        // Mensaje descriptivo
  originalAmount: number;                 // Monto original
  finalAmount: number;                    // Monto final
  discount: number;                       // Descuento aplicado
}
```

### Extender con Nuevas Estrategias

#### Agregar Nueva Condición

```typescript
// 1. Crear la estrategia
import { PromotionConditionStrategy } from './base-condition.strategy';

export class NewConditionStrategy implements PromotionConditionStrategy {
  readonly type = 'NEW_CONDITION' as const;
  
  validate(cart: CartDto, condition: Condition): boolean {
    // Implementar lógica de validación
    return true;
  }
}

// 2. Registrar en StrategyRegistry
// 3. Agregar tipo al enum en promotion-metadatas.entity.ts
```

#### Agregar Nueva Acción

```typescript
// 1. Crear la estrategia
import { PromotionActionStrategy } from './base-action.strategy';

export class NewActionStrategy implements PromotionActionStrategy {
  readonly type = 'NEW_ACTION' as const;
  
  apply(cart: CartDto, action: Action): ActionResult {
    // Implementar lógica de aplicación
    return { finalAmount, discount, message };
  }
}

// 2. Registrar en StrategyRegistry
// 3. Agregar tipo al enum en promotion-metadatas.entity.ts
```

---

## Instalación y Configuración

### Prerequisitos

- **Node.js** v18+ (LTS recomendado)
- **PostgreSQL** 14+
- **Android Studio** (para desarrollo móvil)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Iv44n/promotion-module-cm.git
cd promotion-module-cm
```

### 2. Configurar Backend (API)

```bash
# Navegar al directorio
cd api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Ejecutar migraciones
npm run migrate

# Iniciar en modo desarrollo
npm run start:dev
```

#### Variables de Entorno (API)

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@localhost:5432/promotions_db

# Servidor
PORT=3000
NODE_ENV=development
```

### 3. Configurar Frontend (Web)

```bash
# Navegar al directorio
cd web

# Instalar dependencias (usando bun o npm)
bun install
# o
npm install

# Iniciar en modo desarrollo
npm run dev
```

### 4. Configurar Mobile (Android)

1. Abrir el directorio `mobile/` en Android Studio
2. Sincronizar Gradle
3. Ejecutar en emulador o dispositivo físico

---

## API Reference

### Promociones

#### Listar Promociones

```http
GET /promotions
```

#### Obtener Promoción por ID

```http
GET /promotions/:id
```

#### Crear Promoción

```http
POST /promotions
Content-Type: application/json

{
  "name": "Descuento de Verano",
  "description": "20% en productos de temporada",
  "promotionType": 1,
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z"
}
```

#### Activar/Desactivar Promoción

```http
PATCH /promotions/:id/toggle
```

### Motor de Promociones

#### Aplicar Promoción

```http
POST /promotion-engine/apply
Content-Type: application/json

{
  "promotionId": "uuid-de-promocion",
  "cart": {
    "totalAmount": 150.00,
    "items": [
      {
        "productId": "uuid-producto",
        "categoryId": "uuid-categoria",
        "quantity": 2,
        "price": 75.00
      }
    ]
  }
}
```

**Respuesta Exitosa:**

```json
{
  "status": "APPLIED",
  "promotionId": "uuid-de-promocion",
  "message": "Descuento del 20% aplicado",
  "originalAmount": 150.00,
  "finalAmount": 120.00,
  "discount": 30.00
}
```

---

## Estructura del Proyecto

### Backend (API)

```
api/
├── src/
│   ├── common/                     # Utilidades compartidas
│   ├── database/                   # Configuración de base de datos
│   │   └── drizzle.schema.ts       # Schema de Drizzle ORM
│   ├── exception/                  # Manejo de excepciones
│   ├── modules/
│   │   ├── promotions/             # Módulo CRUD de promociones
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── entities/           # Entidades de Drizzle
│   │   │   ├── metadata/           # Metadatos de tipos
│   │   │   ├── promotions.controller.ts
│   │   │   ├── promotions.service.ts
│   │   │   └── promotions.repository.ts
│   │   └── promotion-engine/       # Motor de promociones
│   │       ├── dto/                # DTOs del engine
│   │       ├── rules/              # Definiciones de reglas
│   │       ├── strategies/         # Estrategias
│   │       │   ├── actions/        # Estrategias de acciones
│   │       │   ├── conditions/     # Estrategias de condiciones
│   │       │   └── strategy.registry.ts
│   │       ├── promotion-engine.controller.ts
│   │       ├── promotion-engine.service.ts
│   │       └── promotion-engine.repository.ts
│   ├── app.module.ts
│   └── main.ts
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### Frontend (Web)

```
web/
├── src/
│   ├── api/                        # Clientes API
│   ├── assets/                     # Recursos estáticos
│   ├── components/                 # Componentes React
│   │   └── ui/                     # Componentes shadcn/ui
│   ├── context/                    # Contextos React
│   ├── hooks/                      # Custom hooks
│   ├── lib/                        # Utilidades
│   ├── pages/                      # Páginas de la aplicación
│   ├── store/                      # Estado global (Zustand)
│   ├── test/                       # Tests
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

### Mobile (Android)

```
mobile/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/moduloventa/
│   │       └── res/
│   └── build.gradle.kts
├── gradle/
├── build.gradle.kts
├── settings.gradle.kts
├── gradlew
└── gradlew.bat
```

---

## Testing

### Backend

```bash
cd api

# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

### Frontend

```bash
cd web

# Tests
npm run test

# Tests en modo watch
npm run test:watch
```

---

## Scripts Disponibles

### API

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Inicia en modo desarrollo con hot-reload |
| `npm run build` | Compila para producción |
| `npm run start:prod` | Inicia versión compilada |
| `npm run generate` | Genera migraciones de Drizzle |
| `npm run migrate` | Ejecuta migraciones pendientes |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea código con Prettier |

### Web

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta Biome linter |
| `npm run format` | Formatea código con Biome |

---
