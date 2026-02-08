# ✅ Checklist de Deployment - Mercado Turismo

## Configuración de URLs

### Frontend

- ✅ `.env.production`: `VITE_API_URL=https://api.mercadoturismo.ar/api`
- ✅ `.env` (local): `VITE_API_URL=https://api.mercadoturismo.ar/api`
- ✅ `api.config.js`: Usa variables de entorno correctamente
- ✅ Sin referencias hardcodeadas a localhost en código fuente

### Backend

- ✅ `.env.production`: `FRONTEND_URL=https://mercadoturismo.ar`
- ✅ `src/index.js`: CORS configurado para dominios permitidos
- ✅ `.htaccess`: Configurado para Phusion Passenger
- ✅ `app.js`: Entry point correcto para Passenger

## Archivos Críticos

### Frontend

```
frontend/
├── .env                    ✅ Configurado
├── .env.production         ✅ Configurado
├── .htaccess              ✅ Configurado para SPA
├── vite.config.js         ✅ Configurado
└── src/config/api.config.js ✅ Usa variables de entorno
```

### Backend

```
backend/
├── .env                    ⚠️  Crear en servidor con .env.production
├── .env.production         ✅ Plantilla lista
├── .htaccess              ✅ Configurado para Passenger
├── app.js                 ✅ Entry point
└── src/index.js           ✅ CORS y configuración OK
```

## Pasos para Deployment

### 1. Frontend

```bash
cd frontend
npm install
npm run build
# Subir contenido de dist/ a public_html/
```

### 2. Backend

```bash
# En el servidor:
cd ~/api.mercadoturismo.ar
# Copiar .env.production a .env
cp .env.production .env
# Editar .env y configurar JWT_SECRET
nano .env
# Instalar dependencias
npm install --production
# Reiniciar Passenger
touch tmp/restart.txt
```

## Verificación Post-Deployment

### Backend Health Check

```bash
curl https://api.mercadoturismo.ar/api/health
```

Debe retornar:

```json
{
  "success": true,
  "status": "OK",
  "environment": "production",
  "jwt": "Configurado"
}
```

### Frontend

1. Abrir https://mercadoturismo.ar
2. Verificar consola del navegador (sin errores de CORS)
3. Probar login
4. Verificar que se carguen paquetes/ofertas

## Variables de Entorno Requeridas

### Backend (.env)

```bash
JWT_SECRET=<generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
NODE_ENV=production
FRONTEND_URL=https://mercadoturismo.ar
```

### Frontend (build time)

```bash
VITE_API_URL=https://api.mercadoturismo.ar/api
```

## Troubleshooting

### Error CORS

- Verificar FRONTEND_URL en backend/.env
- Verificar que frontend esté en https://mercadoturismo.ar

### Error 500

- Revisar logs: `tail -f ~/api.mercadoturismo.ar/logs/production.log`
- Verificar JWT_SECRET configurado
- Verificar permisos de database.sqlite

### Imágenes no cargan

- Verificar permisos: `chmod 755 uploads/`
- Verificar ruta absoluta en Express
- Verificar headers CORS en /uploads

---

📚 Documentación completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
