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
