# Guía de Migración del Sistema de Roles

## ✅ Cambios Implementados

### 1. Backend - Modelo de Usuario (User.model.js)

**Antes:**

```javascript
role: ENUM("admin", "agencia", "operador_agencia", "operador_independiente");
defaultValue: "operador_independiente";
```

**Después:**

```javascript
role: ENUM("admin", "sysadmin", "agencia", "operador");
defaultValue: "operador";
```

### 2. Middleware de Autenticación (auth.middleware.js)

**Nuevos middlewares agregados:**

- `isSysAdmin` - Verifica rol de super administrador
- `isOperador` - Verifica rol de operador
- `isAgencia` - Verifica rol de agencia
- `canPublishCupos` - Permite publicar cupos (operador o agencia)
- `canViewMarketplace` - Permite ver marketplace (solo agencia)

### 3. Controlador de Cupos (cuposMercado.controller.js)

**Cambios principales:**

- ❌ **Eliminada** lógica de compra de cupos
- ✅ **Nueva función** `getCuposMarketplace()` - Solo para agencias, muestra cupos de operadores
- ✅ **Nueva función** `getMisCupos()` - Muestra cupos propios del usuario
- ✅ **Validación** de teléfono al publicar cupos
- ✅ **Asociación** con modelo User para exponer información del vendedor

### 4. Rutas de Cupos (cuposMercado.routes.js)

**Antes:**

```javascript
GET  /                   // Todos los cupos
POST /                   // Crear cupo
PUT  /:id                // Comprar/actualizar cupo
```

**Después:**

```javascript
GET  /marketplace        // Marketplace (solo agencias)
GET  /mis-cupos          // Mis cupos propios
POST /                   // Publicar cupo (operador/agencia)
PUT  /:id                // Actualizar cupo propio
DELETE /:id              // Eliminar cupo propio
```

### 5. Frontend - Componentes Actualizados

#### Dashboard.jsx

- Actualizado mapeo de roles en `getUserRole()`

#### Usuarios.jsx, UsuarioFormModal.jsx, UsuarioEditModal.jsx

- Actualizados options de roles
- Actualizados badges y estilos de roles
- Actualizado filtro de operadores

#### Ajustes.jsx

- Actualizado mapeo de nombres de roles

#### MercadoCupos.jsx

**Cambios completos:**

- ✅ Tabs de navegación: "Mis Cupos" y "Marketplace"
- ✅ Permisos por rol:
  - **Operador**: Solo ve "Mis Cupos", puede publicar
  - **Agencia**: Ve "Mis Cupos" y "Marketplace", puede publicar
- ❌ **Eliminado** botón de compra
- ✅ **Agregado** botón de WhatsApp con enlace directo
- ✅ Muestra información del vendedor (nombre, razón social, teléfono)
- ✅ Validación de permisos antes de mostrar contenido

#### cupos.service.js

- `getCuposMarketplace()` - Nueva función para marketplace
- `getMisCupos()` - Nueva función para cupos propios

### 6. Estilos (dashboard.css)

- Agregados estilos para `.tabs-container` y `.tab-button`
- Agregados estilos para `.btn-whatsapp`
- Agregados efectos hover y transiciones

### 7. Script de Migración (migrate-roles.js)

**Funcionalidad:**

1. Altera temporalmente el enum para incluir roles antiguos
2. Migra `operador_independiente` → `operador`
3. Migra `operador_agencia` → `operador`
4. Elimina roles antiguos del enum
5. Reporta usuarios sin teléfono
6. Muestra estadísticas finales

## 📋 Matriz de Permisos

| Acción                 | Operador | Agencia | Admin | SysAdmin |
| ---------------------- | -------- | ------- | ----- | -------- |
| Publicar cupos         | ✅       | ✅      | ✅    | ✅       |
| Ver mis cupos          | ✅       | ✅      | ✅    | ✅       |
| Ver marketplace        | ❌       | ✅      | ✅    | ✅       |
| Ver cupos de otros     | ❌       | ✅      | ✅    | ✅       |
| Comprar cupos          | ❌       | ❌      | ❌    | ❌       |
| Contactar vía WhatsApp | -        | ✅      | ✅    | ✅       |

## 🔄 Flujo del Marketplace

### Operador:

1. Publica cupo con su teléfono
2. Ve solo sus propios cupos
3. No accede al marketplace

### Agencia:

1. Puede publicar cupos
2. Ve sus propios cupos en tab "Mis Cupos"
3. Ve cupos de operadores en tab "Marketplace"
4. Contacta operadores vía WhatsApp directamente
5. Negocia compra por fuera del sistema

## 🚀 Cómo Ejecutar la Migración

### 1. Backup de la base de datos (Recomendado)

```bash
# SQLite
cp backend/database.sqlite backend/database.backup.sqlite
```

### 2. Ejecutar el script de migración

```bash
cd backend
node src/migrate-roles.js
```

### 3. Verificar la migración

El script mostrará:

- ✅ Usuarios migrados
- ⚠️ Usuarios sin teléfono
- 📊 Estadísticas finales de roles

### 4. Actualizar usuarios sin teléfono

Después de la migración, es importante que operadores y agencias agreguen su número de teléfono para poder publicar cupos en el marketplace.

## ⚠️ Puntos Importantes

### Validaciones

1. **Teléfono obligatorio** para publicar cupos
2. Solo el **vendedor** puede actualizar/eliminar su cupo
3. Solo **agencias** pueden ver marketplace
4. **Operadores** solo ven sus cupos

### Seguridad

- Tokens JWT incluyen el rol actualizado
- Middleware valida permisos en cada endpoint
- Frontend verifica roles antes de mostrar opciones

### Datos del Vendedor

Los cupos ahora incluyen información completa del vendedor:

```javascript
{
  id: 1,
  tipoProducto: "Excursión",
  descripcion: "...",
  cantidad: 10,
  precioMayorista: 5000,
  // ...
  vendedor: {
    id: 5,
    nombre: "Juan Pérez",
    email: "juan@operador.com",
    telefono: "+5491112345678",
    razonSocial: "Turismo JP S.A."
  }
}
```

## 🐛 Troubleshooting

### Error: "Column role has incorrect value"

**Solución:** Ejecutar el script de migración que actualiza el enum correctamente.

### Error: "Debes agregar un número de teléfono"

**Solución:** El usuario debe actualizar su perfil en Ajustes y agregar su número de teléfono.

### No veo el marketplace

**Verificar:**

- ¿Tu rol es "agencia"?
- ¿Hay cupos publicados por operadores?
- ¿El token JWT está actualizado?

### Botón de WhatsApp no funciona

**Verificar:**

- El operador tiene teléfono configurado
- El formato del teléfono es correcto (incluye código de país)
- El navegador permite abrir ventanas emergentes

## 📝 Notas Adicionales

- La migración es **irreversible** sin un backup
- Los roles antiguos se eliminan permanentemente del sistema
- Los datos de cupos existentes se mantienen intactos
- La lógica de compra directa fue completamente removida
- El sistema ahora actúa como un directorio/marketplace de contactos

## ✨ Mejoras Futuras Sugeridas

1. **Notificaciones**: Alertar a operadores cuando una agencia contacta
2. **Estadísticas**: Tracking de clicks en botones de WhatsApp
3. **Favoritos**: Permitir a agencias marcar operadores favoritos
4. **Filtros avanzados**: Por ubicación, categoría, precio, etc.
5. **Verificación**: Badges de operadores verificados
6. **Reviews**: Sistema de calificación de operadores
