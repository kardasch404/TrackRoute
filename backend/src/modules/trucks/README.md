# Truck Module - RBAC Implementation

## Architecture Overview

### Role-Based Access Control (RBAC)

This module implements a **hierarchical permission-based access control** system:

```
Authentication → Role Check → Permission Check → Resource Access
```

### Key Principles

1. **Admin Supremacy**: Admin role bypasses all permission checks
2. **Permission-Based**: Other roles require explicit permissions
3. **Fail-Safe**: Deny by default, allow by exception

## Access Control Flow

### 1. Authentication Layer (`authMiddleware`)
- Validates JWT token
- Fetches user from database with permissions
- Attaches user object to request: `{ userId, role, permissions[] }`

### 2. Authorization Layer (`rbacMiddleware`)
```typescript
// Admin Check (Priority 1)
if (user.role === 'ADMIN') {
  return next(); // Admin has ALL permissions
}

// Permission Check (Priority 2)
if (user.permissions.includes(requiredPermission)) {
  return next(); // User has specific permission
}

// Deny Access (Default)
throw ForbiddenException();
```

## Truck CRUD Permissions

| Action | Permission | Admin | Driver |
|--------|-----------|-------|--------|
| Create | `truck:create` | ✅ | ❌ |
| Read | `truck:read` | ✅ | ❌ |
| Update | `truck:update` | ✅ | ❌ |
| Delete | `truck:delete` | ✅ | ❌ |

## Route Protection

```typescript
router.post('/', 
  authMiddleware,                           // Step 1: Verify JWT
  rbacMiddleware([Permission.TRUCK_CREATE]), // Step 2: Check permission
  validationMiddleware(createTruckSchema),   // Step 3: Validate input
  truckController.createTruck                // Step 4: Execute
);
```

## Best Practices Implemented

✅ **Separation of Concerns**: Auth, RBAC, Validation are separate middlewares
✅ **Admin Bypass**: Admin role has implicit all permissions
✅ **Database-Driven**: Permissions loaded from DB, not hardcoded
✅ **Type Safety**: TypeScript interfaces for user and permissions
✅ **Fail-Safe**: Deny by default security model
✅ **Middleware Chain**: Clear, testable middleware pipeline
✅ **Single Responsibility**: Each middleware does one thing well

## Security Notes

- Only **ADMIN** can manage trucks (create, update, delete)
- Permissions are checked on **every request**
- Token expiration is enforced
- Inactive users are rejected
- Database queries exclude password field
