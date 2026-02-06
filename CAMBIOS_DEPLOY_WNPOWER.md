# ✅ Cambios Realizados para Deploy en WNPower

## 📅 Fecha: 6 de Febrero, 2026

## 🎯 Objetivo
Configurar el proyecto para deploy en WNPower usando Node.js + Passenger, eliminando la necesidad de especificar puerto manualmente.

## 🔧 Cambios Realizados

### 1. Backend

#### `.htaccess` actualizado
- ✅ Eliminada la línea `SetEnv PORT 3001` (Passenger asigna puerto automáticamente)
- ✅ Agregado `PassengerAppRoot` con ruta del servidor
- ✅ Configurado `PassengerLogLevel 3` para debug
- ✅ Agregada protección para archivo `.env`
- ✅ Configurada compresión con mod_deflate

#### `.env` actualizado
- ✅ Comentado el `PORT` para producción
- ✅ Documentado que PORT solo es para desarrollo local
- ✅ Configurado FRONTEND_URL para desarrollo

#### `.env.example` actualizado  
- ✅ Agregada documentación clara sobre PORT
- ✅ Agregadas instrucciones para generar JWT_SECRET seguro
- ✅ Sección de configuración de producción bien documentada

#### `.env.production` creado
- ✅ Template para configuración de producción
- ✅ Sin PORT especificado (correcto para Passenger)
- ✅ Variables de entorno para WNPower

#### `app.js` (sin cambios)
- ✅ Ya estaba correctamente configurado para Passenger
- ✅ Exporta la app sin hacer listen()

#### `src/index.js` (sin cambios)
- ✅ Ya detecta correctamente si corre bajo Passenger
- ✅ Solo hace listen() si se ejecuta directamente (desarrollo)

### 2. Frontend

#### `.env.production` actualizado
- ✅ Corregida variable de `VITE_API_BASE_URL` a `VITE_API_URL` (consistencia)
- ✅ URL apunta a `https://mercadoturismo.ar/api`

#### `.htaccess` actualizado
- ✅ Mantenida regla para no tocar peticiones a `/api/`
- ✅ Agregados headers de seguridad (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ Configurada compresión gzip
- ✅ Configurada caché agresiva para assets (1 año)
- ✅ Sin caché para index.html (actualizaciones inmediatas)
- ✅ HTTPS redirect comentado (descomentar si se desea)

### 3. Documentación

#### `DEPLOY_WNPOWER.md` creado
- ✅ Guía completa paso a paso para deploy
- ✅ Requisitos previos
- ✅ Configuración de backend
- ✅ Configuración de frontend
- ✅ Sección de troubleshooting
- ✅ Checklist de deploy
- ✅ Consideraciones de seguridad

#### `prepare-deploy.sh` creado
- ✅ Script bash para preparar archivos para deploy
- ✅ Instala dependencias
- ✅ Build del frontend
- ✅ Copia archivos necesarios a carpeta `deploy-wnpower/`
- ✅ Excluye archivos innecesarios (node_modules, .git, logs, etc.)
- ✅ Muestra checklist de siguientes pasos

## 📁 Estructura de Deploy

```
WNPower Server:
/home/mercadoturismo/
├── backend/              # Backend Node.js con Passenger
│   ├── src/
│   ├── uploads/
│   ├── app.js           # Entry point para Passenger
│   ├── .htaccess        # Configuración Passenger
│   ├── .env             # Variables de entorno (crear en servidor)
│   ├── package.json
│   └── database.sqlite
└── public_html/         # Frontend (React build)
    ├── assets/
    ├── index.html
    └── .htaccess        # Configuración SPA
```

## 🚀 Cómo Deployar

### Opción 1: Usando el script (recomendado)

```bash
# En tu máquina local
bash prepare-deploy.sh

# Subir carpetas generadas:
# - deploy-wnpower/backend/ → /home/mercadoturismo/backend/
# - deploy-wnpower/frontend/ → /home/mercadoturismo/public_html/

# Conectar por SSH
ssh usuario@mercadoturismo.ar
cd /home/mercadoturismo/backend
npm install --production

# Crear .env con valores de producción
nano .env
# (copiar desde .env.production y ajustar valores)

# Reiniciar Passenger
mkdir -p tmp && touch tmp/restart.txt
```

### Opción 2: Manual

Ver instrucciones detalladas en [DEPLOY_WNPOWER.md](DEPLOY_WNPOWER.md)

## ✅ Verificaciones

- [x] Backend configurado para no usar PORT explícito
- [x] .htaccess del backend con PassengerAppRoot correcto
- [x] .env.production creado con variables necesarias
- [x] Frontend .env.production con URL correcta
- [x] .htaccess del frontend optimizado con caché y compresión
- [x] Script de deploy automatizado creado
- [x] Documentación completa en DEPLOY_WNPOWER.md

## 🔒 Seguridad

**IMPORTANTE antes de subir a producción:**

1. **Generar JWT_SECRET seguro:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Verificar permisos en servidor:**
   ```bash
   chmod 644 .env .htaccess
   chmod 755 uploads/
   ```

3. **Verificar que .env no es accesible públicamente**

## 📝 Notas

- Passenger asigna el puerto automáticamente, NO especificar PORT en `.env` de producción
- El backend ya estaba bien configurado (app.js y index.js correctos)
- El frontend usa variables de Vite: `VITE_API_URL`
- La URL de API en producción es: `https://mercadoturismo.ar/api`
- Los logs de Passenger están en: `/home/mercadoturismo/backend/log/`

## 🐛 Troubleshooting

Si algo no funciona después del deploy:

1. Revisar logs de Passenger: `tail -f log/passenger.log`
2. Verificar .env existe y tiene todas las variables
3. Verificar .htaccess tiene PassengerAppRoot correcto
4. Reiniciar Passenger: `touch tmp/restart.txt`
5. Consultar [DEPLOY_WNPOWER.md](DEPLOY_WNPOWER.md) sección troubleshooting

## 📞 Siguientes Pasos

1. Ejecutar `bash prepare-deploy.sh`
2. Subir archivos al servidor
3. Instalar dependencias en servidor
4. Crear `.env` con valores de producción
5. Verificar funcionamiento
6. Revisar checklist completo en DEPLOY_WNPOWER.md
