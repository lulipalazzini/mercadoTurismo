# 🚀 Guía de Deployment en WNPower - Paso a Paso

## ⚠️ Problema Actual

El servidor está devolviendo HTML en lugar de JSON, causando el error:

```
SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

Esto ocurre porque falta configurar las variables de entorno en el servidor.

---

## 📋 Pre-requisitos

Antes de hacer deploy, asegúrate de tener:

1. ✅ Acceso SSH o File Manager en WNPower
2. ✅ Node.js instalado en el servidor (verifica con `node -v`)
3. ✅ Permisos de escritura en el directorio

---

## 🔧 Pasos para Deploy

### 1️⃣ Subir archivos al servidor

**Opción A: Via Git (recomendado)**

```bash
# En tu servidor (via SSH)
cd /home/tu_usuario/public_html
git clone https://github.com/tu-usuario/mercadoTurismo.git
cd mercadoTurismo/backend
```

**Opción B: Via FTP/File Manager**

- Subir SOLO la carpeta `backend/` completa
- NO subir: `node_modules/`, `.env`, `database.sqlite`, archivos `.bat`, `.ps1`

---

### 2️⃣ Instalar dependencias

```bash
cd /home/tu_usuario/public_html/mercadoTurismo/backend
npm install --production
```

**IMPORTANTE**: Si hay errores, puede que necesites:

```bash
npm install --legacy-peer-deps --production
```

---

### 3️⃣ Crear archivo `.env` en el servidor

**CRÍTICO**: Este es el paso más importante. Crea un archivo `.env` en la carpeta `backend/`:

```bash
# Generar un JWT_SECRET seguro (ejecutar en el servidor):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Luego crea el archivo `.env` con este contenido:

```env
# Puerto (Passenger lo maneja automáticamente, pero lo necesitamos)
PORT=3001

# JWT Secret - USA EL QUE GENERASTE ARRIBA
JWT_SECRET=AQUI_PEGA_EL_SECRET_QUE_GENERASTE

# Entorno
NODE_ENV=production

# URL del frontend (tu dominio real)
FRONTEND_URL=https://mercadoturismo.ar
```

**Cómo crear el archivo:**

**Via SSH:**

```bash
nano .env
# Pega el contenido, Ctrl+X, Y, Enter
```

**Via File Manager:**

1. Crear nuevo archivo llamado `.env`
2. Pegar el contenido
3. Guardar

---

### 4️⃣ Verificar configuración de .htaccess

El archivo `.htaccess` ya está configurado correctamente. Verifica que contenga:

```apache
PassengerEnabled On
PassengerAppType node
PassengerStartupFile app.js

SetEnv NODE_ENV production
SetEnv PORT 3001
```

---

### 5️⃣ Verificar permisos

```bash
# Dar permisos de ejecución
chmod +x app.js
chmod 755 src/
```

---

### 6️⃣ Inicializar la base de datos

```bash
# Crear la base de datos
touch database.sqlite
chmod 666 database.sqlite
```

---

### 7️⃣ Reiniciar Passenger

```bash
# Crear carpeta tmp si no existe
mkdir -p tmp

# Reiniciar la aplicación
touch tmp/restart.txt
```

**O desde cPanel:**

1. Ir a "Setup Node.js App"
2. Seleccionar tu aplicación
3. Click en "Restart"

---

## 🧪 Verificar que funciona

### Test 1: Health Check

```bash
curl https://mercadoturismo.ar/api/health
```

Deberías ver:

```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-02-05T...",
  "environment": "production"
}
```

### Test 2: Login

Intenta hacer login desde el frontend. Si funciona, todo está bien.

### Test 3: Ver logs

```bash
# Ver últimos logs de Passenger
tail -f ~/passenger.log
# O desde cPanel: ver logs en la configuración de Node.js App
```

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot find module"

```bash
cd backend
npm install
touch tmp/restart.txt
```

### ❌ Error: "JWT must be provided"

- Verifica que el archivo `.env` existe
- Verifica que tiene `JWT_SECRET=...`
- Reinicia Passenger: `touch tmp/restart.txt`

### ❌ Error: "Permission denied"

```bash
chmod -R 755 backend/
chmod 666 backend/database.sqlite
```

### ❌ Sigue devolviendo HTML

1. Verifica que `.env` existe: `ls -la | grep .env`
2. Verifica el contenido: `cat .env`
3. Reinicia: `touch tmp/restart.txt`
4. Espera 30 segundos y prueba de nuevo

### ❌ Error de CORS

Asegúrate de que `FRONTEND_URL` en `.env` coincida con tu dominio real.

---

## 📝 Checklist Final

Antes de considerar el deploy completo, verifica:

- [ ] `npm install` completado sin errores
- [ ] Archivo `.env` creado con JWT_SECRET válido
- [ ] `.htaccess` configurado correctamente
- [ ] Base de datos `database.sqlite` existe y tiene permisos
- [ ] `touch tmp/restart.txt` ejecutado
- [ ] `curl https://mercadoturismo.ar/api/health` devuelve JSON (no HTML)
- [ ] Login funciona desde el frontend
- [ ] Clicks se registran correctamente

---

## 🆘 Si nada funciona

1. **Revisar logs de error:**

   ```bash
   tail -f ~/logs/error_log
   tail -f ~/passenger.log
   ```

2. **Modo debug:** Editar `.htaccess` y agregar:

   ```apache
   PassengerLogLevel 7
   ```

3. **Verificar que Node.js está disponible:**

   ```bash
   which node
   node -v
   npm -v
   ```

4. **Contactar soporte de WNPower** con:
   - Logs de error
   - Configuración de .htaccess
   - Versión de Node.js

---

## 🔄 Para actualizaciones futuras

Cuando hagas cambios en el código:

```bash
# En tu máquina local
git add .
git commit -m "Descripción del cambio"
git push origin main

# En el servidor
cd /home/tu_usuario/public_html/mercadoTurismo/backend
git pull origin main
npm install  # Solo si cambiaste package.json
touch tmp/restart.txt
```

---

## ✅ Deploy exitoso

Si llegaste aquí y todo funciona:

1. El health check devuelve JSON ✅
2. El login funciona ✅
3. Los clicks se registran ✅

**¡Felicitaciones! Tu aplicación está en producción correctamente.**
