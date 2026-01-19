# Checklist Final - Deploy BaeHost

## ✅ Frontend - Lista de Verificación

- [x] Variables de entorno configuradas (`.env.production`)
- [x] Build optimizado con `npm run build`
- [x] `.htaccess` en `public/` para SPA routing
- [x] Endpoints dinámicos usando `VITE_API_URL`
- [x] FontAwesome CDN cargado en `index.html`
- [x] Cache configurado en `.htaccess`

## ✅ Backend - Lista de Verificación

- [ ] Variables de entorno en `.env` configuradas
- [ ] JWT_SECRET cambiado a valor seguro
- [ ] ALLOWED_ORIGINS contiene dominio BaeHost
- [ ] Database SQLite con permisos correctos
- [ ] CORS configurado correctamente
- [ ] PORT dinámico según BaeHost

## ✅ Estructura de Carpetas

```
frontend/
├── dist/              ← Sube esto a public_html/
├── public/
│   └── .htaccess      ← Copia a public_html/ en BaeHost
├── .env.production    ← Copia config a servidor
├── vite.config.js     ✓
└── package.json       ✓

backend/
├── src/
│   ├── index.js       ✓
│   ├── models/        ✓
│   ├── routes/        ✓
│   └── config/        ✓
├── .env               ← Crear en servidor
├── database.sqlite    ← Se crea automático
└── package.json       ✓
```

## 📋 Archivos Creados para BaeHost

1. **frontend/.env.example** - Plantilla variables frontend
2. **frontend/.env.production** - Config producción frontend
3. **frontend/public/.htaccess** - Routing SPA para Apache
4. **frontend/vite.config.js** - Optimizado para producción
5. **backend/.env.example** - Plantilla variables backend
6. **backend/src/index.js** - CORS dinámico configurado
7. **DEPLOY_BAEHOST.md** - Guía completa deployment

## 🚀 Pasos Rápidos

```bash
# 1. Frontend
cd frontend
npm install
npm run build:prod

# 2. Sube frontend/dist/* a public_html/ via FTP
# 3. Sube frontend/public/.htaccess a public_html/

# 4. Backend (en servidor BaeHost)
cd backend
npm install
# Edita .env con valores de producción
npm start
```

## 🔐 Valores Críticos a Cambiar

| Archivo | Clave | Valor Actual | Cambiar a |
|---------|-------|-------------|-----------|
| `.env.production` | `VITE_API_URL` | URL dinámica | `https://www4.baehost.com/api` |
| `backend/.env` | `JWT_SECRET` | Ejemplo genérico | **Valor único y fuerte** |
| `backend/.env` | `ALLOWED_ORIGINS` | localhost | `https://www4.baehost.com` |
| `backend/.env` | `NODE_ENV` | development | `production` |

## ✨ Características Implementadas

✅ Variables de entorno dinámicas
✅ CORS configurable
✅ SPA routing con .htaccess
✅ Cache de assets en navegador
✅ Compresión GZIP habilitada
✅ Rate limiting de seguridad
✅ JWT Authentication
✅ SQLite local (sin dependencias externas)

## 📞 Si Algo Falla

1. Verifica logs en BaeHost (cPanel → Errores)
2. Confirma CORS permitiendo tu dominio
3. Revisa permisos de carpetas (755)
4. Valida variables en `.env`
5. Contacta soporte BaeHost para Node.js
