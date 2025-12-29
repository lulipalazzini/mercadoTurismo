# 👥 Usuarios de Ejemplo - MercadoTurismo

Este documento contiene los usuarios de prueba para testing del sistema de autenticación.

## 📋 Usuarios Disponibles

### 1️⃣ Operador Independiente

**Perfil:** Operador turístico que trabaja de forma independiente ofreciendo servicios especializados.

```
Email: carlos.rodriguez@gmail.com
Contraseña: Password123!
```

**Información del Perfil:**

- **Nombre:** Carlos Rodríguez
- **CUIT:** 20-34567890-5
- **Teléfono:** +54 11 5234-8976
- **Fecha de inicio:** 15/03/2020
- **Especialidades:**
  - Tours de aventura
  - Turismo rural
  - Senderismo
- **Áreas de cobertura:** Mendoza, San Juan, La Rioja

---

### 2️⃣ Agencia de Viajes

**Perfil:** Agencia de viajes establecida con múltiples sucursales y equipo completo.

```
Email: contacto@viajesdelsur.com.ar
Contraseña: AgenciaPass2024!
```

**Información del Perfil:**

- **Razón Social:** Viajes del Sur S.A.
- **CUIT:** 30-12345678-9
- **EVT:** EVT-12345
- **Teléfono:** +54 11 4567-1234
- **Dirección:** Av. Corrientes 1234, CABA
- **Fecha de inicio:** 20/08/2015
- **Empleados:** 25
- **Sucursales:**
  - Sucursal Centro: Av. Corrientes 1234, CABA
  - Sucursal Palermo: Av. Santa Fe 3456, CABA
- **Especialidades:**
  - Paquetes internacionales
  - Cruceros
  - Turismo corporativo
  - Luna de miel

---

### 3️⃣ Operador de Agencia

**Perfil:** Empleado de una agencia con permisos específicos para operar en el sistema.

```
Email: maria.gonzalez@turismoexpress.com
Contraseña: OperadorPass2024!
```

**Información del Perfil:**

- **Nombre:** María González
- **Agencia:** Turismo Express SRL
- **CUIT Agencia:** 30-98765432-1
- **EVT Agencia:** EVT-54321
- **Teléfono:** +54 11 6789-4321
- **Cargo:** Ejecutiva de Ventas Senior
- **Departamento:** Ventas Corporativas
- **ID Empleado:** TE-2024-089
- **Fecha de ingreso:** 10/06/2021
- **Permisos:**
  - Reservar paquetes
  - Emitir vouchers
  - Acceso a tarifas especiales
  - Gestión de clientes

**Información de la Agencia:**

- **Nombre:** Turismo Express SRL
- **Dirección:** Av. Callao 567, CABA
- **Teléfono Principal:** +54 11 4321-9876

---

## 🛠️ Uso del Helper de Desarrollo

En la página de login encontrarás un botón flotante "👤 DEV" en la esquina inferior derecha que te permite:

1. Ver todos los usuarios de prueba disponibles
2. Copiar las credenciales con un clic
3. Auto-completar el formulario de login

**⚠️ Nota:** Este componente debe ser removido antes de pasar a producción.

---

## 📝 Casos de Uso

### Operador Independiente

- Gestión de servicios propios
- Publicación de tours especializados
- Control de reservas directas
- Actualización de disponibilidad

### Agencia de Viajes

- Gestión multi-sucursal
- Administración de equipo
- Acceso a múltiples proveedores
- Reportes corporativos
- Gestión de inventario

### Operador de Agencia

- Ventas en nombre de la agencia
- Emisión de vouchers
- Consulta de tarifas especiales
- Gestión de clientes asignados
- Permisos limitados según rol

---

## 🔒 Seguridad

Estos usuarios son **únicamente para desarrollo y testing**.

En producción:

- No incluir credenciales hardcodeadas
- Implementar autenticación real con JWT o similar
- Usar variables de entorno para datos sensibles
- Remover el componente DevHelper
- Implementar rate limiting
- Agregar 2FA para cuentas sensibles

---

## 📦 Archivos Relacionados

- `src/data/exampleUsers.js` - Datos de usuarios de ejemplo
- `src/components/DevHelper.jsx` - Componente helper de desarrollo
- `src/styles/devhelper.css` - Estilos del helper
- `src/components/Login.jsx` - Integración del helper

---

**Última actualización:** Diciembre 2025
