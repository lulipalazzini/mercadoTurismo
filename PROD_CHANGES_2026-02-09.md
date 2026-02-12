# Cambios en Produccion (2026-02-09)

Este archivo resume los ajustes realizados en el servidor para dejar el backend funcionando bajo
cPanel + CloudLinux + Passenger.

## Configuracion en cPanel (Node.js App)

- Application root: `/home/mercad25/api.mercadoturismo.ar/backend`
- Application URL: `/`
- Startup file: `app.js`
- Node.js version: `18.20.8`

## DocumentRoot del subdominio

- DocumentRoot confirmado: `/home/mercad25/api.mercadoturismo.ar`
- Se creo `.htaccess` en ese DocumentRoot para montar Passenger con ruta absoluta:

```apache
PassengerEnabled On
PassengerAppType node
PassengerAppRoot /home/mercad25/api.mercadoturismo.ar/backend
PassengerBaseURI /
PassengerStartupFile app.js
PassengerNodejs /opt/alt/alt-nodejs18/root/usr/bin/node
PassengerAppLogFile /home/mercad25/new_logs.log
```

## Instalacion de dependencias

El build de `sqlite3` fallo usando `/usr/bin/env node`. Se soluciono forzando el PATH:

```bash
export PATH="/opt/alt/alt-nodejs18/root/usr/bin:$PATH"
node -v
npm install --production
```

## Verificacion

- Endpoint OK: `https://api.mercadoturismo.ar/api/health` -> 200

## Pendiente (DB)

- Error actual: `SQLITE_ERROR: no such table: trenes`
- Falta ejecutar seed/migracion que crea la tabla `trenes` en `database.sqlite`.

## Cambios posteriores

- Seeders convertidos a CommonJS en `backend/src/seeders/` para evitar errores ESM.
- Nueva migracion para columnas `imagenes` y tabla `trenes`:
  - `backend/migrations/add-imagenes-columns.js`
- Errores en produccion detectados:
  - `SQLITE_ERROR: no such column: Seguro.imagenes`
  - `SQLITE_ERROR: no such column: Transfer.imagenes`
  - `SQLITE_ERROR: no such column: Paquete.imagenes`

## Ajuste frontend (2026-02-11)

- Se fortalecio la normalizacion de rutas de imagen para casos malformados como:
  - `.mercadoturismo.ar/api/uploads/...`
  - `/.mercadoturismo.ar/api/uploads/...`
- Archivos ajustados:
  - `frontend/src/utils/imageUtils.js`
  - `frontend/src/components/common/DragDropImageUpload.jsx`
  - `frontend/src/components/common/ImageUpload.jsx`
  - `frontend/src/components/ImageUploader.jsx`
- Objetivo:
  - Evitar que el browser resuelva rutas relativas invalidas a URLs rotas del tipo:
    `https://mercadoturismo.ar/.mercadoturismo.ar/api/uploads/...`

## Fix critico URL de imagen (2026-02-11)

- Causa raiz detectada:
  - En `frontend/src/config/api.config.js`, la linea
    `BASE_URL = API_URL.replace('/api', '')`
    eliminaba el primer `/api` encontrado.
  - Con `VITE_API_URL=https://api.mercadoturismo.ar/api`, eso generaba:
    - `https:/.mercadoturismo.ar/api`
  - Resultado en produccion:
    - URLs rotas tipo `https:/.mercadoturismo.ar/api/uploads/...`
- Cambio aplicado:
  - `BASE_URL` ahora se calcula quitando solo el segmento final `/api`:
    - `removeTrailingApiSegment(url) => url.replace(/\/api\/?$/i, "")`
  - Archivo:
    - `frontend/src/config/api.config.js`
- Impacto:
  - `getImageUrl('/uploads/archivo.jpg')` pasa a generar correctamente:
    - `https://api.mercadoturismo.ar/uploads/archivo.jpg`
