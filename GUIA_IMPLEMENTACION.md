# 🚀 Guía Rápida de Implementación

## ⏱️ Tiempo estimado: 5 minutos

---

## 📋 Pre-requisitos

- ✅ Node.js instalado
- ✅ Backend y Frontend configurados
- ✅ Base de datos SQLite funcionando

---

## 🔄 Pasos de Implementación

### 1️⃣ **Backup de Seguridad** (IMPORTANTE)

```bash
# Crear copia de seguridad de la base de datos
cd backend
cp database.sqlite database.backup.sqlite
```

> ⚠️ **Este paso es CRUCIAL**. Si algo sale mal, podrás restaurar desde el backup.

---

### 2️⃣ **Ejecutar Migración de Roles**

```bash
cd backend
node src/migrate-roles.js
```

**Salida esperada:**
```
🔄 Iniciando migración de roles...

✅ Conexión a base de datos establecida

📝 Preparando cambios en la estructura de la tabla...
✅ Estructura preparada

📊 Usuarios a migrar: 5

👥 Lista de usuarios:
   - Juan Pérez (juan@mail.com): operador_independiente → operador
   - María García (maria@mail.com): operador_agencia → operador
   ...

✅ Migrados 3 operadores independientes
✅ Migrados 2 operadores de agencia

📝 Actualizando enum final...
✅ Enum actualizado

⚠️  ADVERTENCIA: 2 usuarios sin teléfono:
   - Juan Pérez (juan@mail.com) - Rol: operador
   - Pedro López (pedro@mail.com) - Rol: operador

❗ Es importante que estos usuarios actualicen su teléfono

📊 Resumen de roles después de la migración:
   operador: 5 usuarios
   agencia: 2 usuarios
   admin: 1 usuarios

✅ Migración completada exitosamente!
```

---

### 3️⃣ **Reiniciar Backend**

```bash
# Si el backend está corriendo, detenerlo (Ctrl+C)
# Luego iniciarlo nuevamente:
npm start
```

**Salida esperada:**
```
✅ SQLite conectado exitosamente
✅ Modelos sincronizados
🚀 Servidor corriendo en puerto 3001
```

---

### 4️⃣ **Verificar Frontend**

```bash
# En otra terminal
cd frontend
npm run dev
```

**Salida esperada:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## ✅ Verificación Post-Migración

### A. **Verificar Roles en la Base de Datos**

Puedes verificar manualmente con SQLite:

```bash
cd backend
sqlite3 database.sqlite
```

```sql
-- Ver todos los usuarios y sus roles
SELECT id, nombre, email, role FROM Users;

-- Verificar que no existan roles antiguos
SELECT COUNT(*) FROM Users WHERE role IN ('operador_independiente', 'operador_agencia');
-- Debería retornar 0

-- Usuarios sin teléfono
SELECT nombre, email, role FROM Users WHERE (telefono IS NULL OR telefono = '') AND role IN ('operador', 'agencia');
```

Salir de SQLite: `.exit`

---

### B. **Verificar en la Aplicación Web**

1. **Login como Admin:**
   - Ir a: http://localhost:5173/login
   - Ingresar credenciales de admin
   - Verificar que el dashboard cargue correctamente

2. **Revisar Usuarios:**
   - Ir a la sección "Usuarios"
   - Verificar que los roles muestren:
     - ✅ Operador
     - ✅ Agencia
     - ✅ Administrador
     - ✅ Super Administrador
   - ❌ No deben aparecer: "Operador Independiente" ni "Operador de Agencia"

3. **Verificar Mercado de Cupos:**
   
   **Como Operador:**
   - Login con credenciales de operador
   - Ir a "Mercado de Cupos"
   - ✅ Debe ver: Solo tab "Mis Cupos"
   - ✅ Puede: Publicar nuevos cupos
   - ❌ NO ve: Tab "Marketplace"

   **Como Agencia:**
   - Login con credenciales de agencia
   - Ir a "Mercado de Cupos"
   - ✅ Debe ver: Tabs "Mis Cupos" y "Marketplace"
   - ✅ Puede: Ver cupos de operadores
   - ✅ Puede: Contactar por WhatsApp
   - ❌ NO ve: Botón "Comprar Cupo"

---

## 🔧 Actualizar Usuarios Sin Teléfono

Si la migración mostró usuarios sin teléfono:

1. **Cada usuario debe:**
   - Login en la aplicación
   - Ir a **Ajustes** → **Perfil**
   - Agregar su número de teléfono
   - Formato: `+5491112345678` (incluir código de país)
   - Guardar cambios

2. **Como Admin puedes:**
   - Ir a **Usuarios**
   - Editar el usuario
   - Agregar teléfono por ellos
   - Guardar cambios

---

## 📞 Probar Función de WhatsApp

1. **Publicar un Cupo como Operador:**
   - Login como operador
   - Asegurarse de tener teléfono configurado
   - Publicar un cupo de prueba

2. **Ver y Contactar como Agencia:**
   - Login como agencia
   - Ir a "Mercado de Cupos" → "Marketplace"
   - Ver el cupo del operador
   - Click en "Contactar por WhatsApp"
   - ✅ Debe abrir WhatsApp Web con mensaje pre-cargado

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Column 'role' cannot be null"
**Causa:** La migración no se ejecutó correctamente

**Solución:**
```bash
# Restaurar backup
cp database.backup.sqlite database.sqlite

# Ejecutar migración nuevamente
node src/migrate-roles.js
```

---

### ❌ Error: "Cannot find module 'migrate-roles.js'"
**Causa:** Estás en el directorio incorrecto

**Solución:**
```bash
# Asegúrate de estar en la carpeta backend
cd backend
pwd  # Debe mostrar: .../mercadoTurismo/backend

# Ejecutar desde ahí
node src/migrate-roles.js
```

---

### ❌ Frontend muestra roles antiguos
**Causa:** Caché del navegador

**Solución:**
1. Hacer logout
2. Limpiar caché del navegador (Ctrl + Shift + Delete)
3. Recargar la página (Ctrl + F5)
4. Login nuevamente

---

### ❌ "Debes agregar un número de teléfono para publicar cupos"
**Causa:** El usuario no tiene teléfono configurado

**Solución:**
1. Ir a Ajustes
2. Agregar teléfono en formato internacional: `+5491112345678`
3. Guardar
4. Intentar publicar nuevamente

---

### ❌ Botón de WhatsApp no funciona
**Posibles causas y soluciones:**

1. **Operador sin teléfono:**
   - Verificar que el operador tenga teléfono configurado

2. **Formato incorrecto:**
   - Teléfono debe incluir código de país
   - Ejemplo correcto: `+5491112345678`
   - Ejemplo incorrecto: `11-1234-5678`

3. **Bloqueador de pop-ups:**
   - Permitir pop-ups para el sitio
   - Configuración del navegador

---

## 🔄 Rollback (En caso de emergencia)

Si algo sale muy mal y necesitas volver atrás:

```bash
cd backend

# Detener el servidor backend
# (Ctrl+C en la terminal donde corre)

# Restaurar backup
cp database.backup.sqlite database.sqlite

# Reiniciar backend
npm start
```

> ⚠️ **Nota:** Esto restaurará la base de datos pero los cambios de código permanecerán. Necesitarías revertir los cambios en Git si quieres volver completamente.

---

## 📊 Checklist Final

Antes de considerar la migración completa, verifica:

- [ ] ✅ Script de migración ejecutado sin errores
- [ ] ✅ Backend reiniciado correctamente
- [ ] ✅ Frontend carga sin errores
- [ ] ✅ Login funciona para admin, operador y agencia
- [ ] ✅ Roles muestran nombres correctos en toda la app
- [ ] ✅ Operadores ven solo "Mis Cupos"
- [ ] ✅ Agencias ven "Mis Cupos" y "Marketplace"
- [ ] ✅ Botón de WhatsApp funciona correctamente
- [ ] ✅ No aparecen botones de "Comprar Cupo"
- [ ] ✅ Usuarios sin teléfono han sido notificados
- [ ] ✅ Backup de base de datos guardado

---

## 🎉 ¡Migración Exitosa!

Si todos los puntos del checklist están marcados, ¡felicitaciones! 

El sistema está ahora funcionando con:
- ✅ Roles simplificados
- ✅ Permisos actualizados
- ✅ Marketplace funcional
- ✅ Integración con WhatsApp

---

## 📚 Documentación Adicional

- **Guía Completa:** Ver [MIGRACION_ROLES.md](MIGRACION_ROLES.md)
- **Resumen de Cambios:** Ver [RESUMEN_CAMBIOS.md](RESUMEN_CAMBIOS.md)
- **Ayuda:** Revisar sección de troubleshooting arriba

---

## 💬 ¿Necesitas Ayuda?

Si encuentras problemas no cubiertos en esta guía:
1. Revisar logs del backend
2. Revisar consola del navegador (F12)
3. Verificar que el backup esté disponible
4. Consultar documentación completa en MIGRACION_ROLES.md
