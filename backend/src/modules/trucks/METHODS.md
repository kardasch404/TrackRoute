# Truck Module - Complete Methods Overview

## 📊 Architecture Layers

```
Routes → Controllers → Services → Repositories → Database
   ↓         ↓            ↓            ↓
Validation  Error      Business     Data Access
  RBAC     Handling     Logic        Layer
```

## 🔐 API Endpoints (All require ADMIN role)

| Method | Endpoint | Permission | Controller | Description |
|--------|----------|-----------|------------|-------------|
| POST | `/trucks` | `truck:create` | `createTruck` | Create new truck |
| GET | `/trucks` | `truck:read` | `getAllTrucks` | List all trucks (with optional status filter) |
| GET | `/trucks/:id` | `truck:read` | `getTruckById` | Get single truck by ID |
| PUT | `/trucks/:id` | `truck:update` | `updateTruck` | Update truck details |
| DELETE | `/trucks/:id` | `truck:delete` | `deleteTruck` | Delete truck |

## 🎯 Service Layer Methods

| Method | Responsibility | Validations |
|--------|---------------|-------------|
| `createTruck(data)` | Create truck | ✅ Check duplicate registration |
| `getTruckById(id)` | Fetch single truck | ✅ Throw 404 if not found |
| `getAllTrucks()` | Fetch all trucks | - |
| `getTrucksByStatus(status)` | Filter by status | - |
| `updateTruck(id, data)` | Update truck | ✅ Check duplicate registration<br>✅ Throw 404 if not found |
| `deleteTruck(id)` | Delete truck | ✅ Throw 404 if not found |

## 💾 Repository Layer Methods

| Method | Database Operation | Returns |
|--------|-------------------|---------|
| `create(data)` | `TruckModel.create()` | `ITruckDocument` |
| `findById(id)` | `TruckModel.findById()` | `ITruckDocument \| null` |
| `findByRegistration(reg)` | `TruckModel.findOne()` | `ITruckDocument \| null` |
| `findByStatus(status)` | `TruckModel.find()` | `ITruckDocument[]` |
| `findAll()` | `TruckModel.find().sort()` | `ITruckDocument[]` |
| `update(id, data)` | `TruckModel.findByIdAndUpdate()` | `ITruckDocument \| null` |
| `delete(id)` | `TruckModel.findByIdAndDelete()` | `ITruckDocument \| null` |

## ✅ Validation Schemas

### Create Truck
```typescript
{
  registration: string (required, uppercase)
  brand: string (required)
  model: string (required)
  year: number (1900 - current+1, required)
  fuelCapacity: number (positive, required)
  currentKm: number (min: 0, default: 0)
  status: enum (default: AVAILABLE)
}
```

### Update Truck
```typescript
{
  registration?: string (uppercase)
  brand?: string
  model?: string
  year?: number (1900 - current+1)
  fuelCapacity?: number (positive)
  currentKm?: number (min: 0)
  status?: enum
}
// At least 1 field required
```

## 🔒 Security Implementation

### Middleware Chain
```
1. authMiddleware       → Verify JWT + Load user permissions
2. rbacMiddleware       → Check ADMIN role or specific permission
3. validationMiddleware → Validate request body (POST/PUT only)
4. controller           → Execute business logic
```

### RBAC Logic
```typescript
// Step 1: Check if user is ADMIN
if (user.role === 'ADMIN') {
  ✅ ALLOW (Admin has all permissions)
}

// Step 2: Check specific permissions
if (user.permissions.includes('truck:create')) {
  ✅ ALLOW
}

// Step 3: Deny by default
❌ FORBIDDEN
```

## 📝 Request/Response Examples

### Create Truck
```bash
POST /trucks
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "registration": "ABC123",
  "brand": "Volvo",
  "model": "FH16",
  "year": 2023,
  "fuelCapacity": 500
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "...",
    "registration": "ABC123",
    "brand": "Volvo",
    "model": "FH16",
    "year": 2023,
    "fuelCapacity": 500,
    "currentKm": 0,
    "status": "AVAILABLE",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get All Trucks (with filter)
```bash
GET /trucks?status=AVAILABLE
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": [...]
}
```

## 🎨 Best Practices Applied

✅ **Repository Pattern**: Data access abstraction
✅ **Service Layer**: Business logic separation
✅ **DTO Pattern**: Input/output data transfer objects
✅ **Validation**: Joi schema validation
✅ **Error Handling**: Custom exceptions (ValidationException, NotFoundException)
✅ **RBAC**: Role-based + Permission-based access control
✅ **Type Safety**: Full TypeScript typing
✅ **Async/Await**: Modern async handling
✅ **Middleware Chain**: Composable request pipeline
✅ **Single Responsibility**: Each layer has one job
