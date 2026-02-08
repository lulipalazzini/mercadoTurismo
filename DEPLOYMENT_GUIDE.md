# Guía de Deployment en WNPower

## 🚀 Preparación para Producción

Este proyecto está configurado para desplegarse en WNPower con las siguientes URLs:
- **Frontend**: https://mercadoturismo.ar
- **API Backend**: https://api.mercadoturismo.ar/api

## 📋 Checklist Pre-Deployment

### Backend (Node.js con Phusion Passenger)

1. **Variables de Entorno** (Archivo `.env` en el servidor)
   ```bash
   # Copiar .env.production y configurar:
   JWT_SECRET=<generar_secret_seguro>
   NODE_ENV=production
   FRONTEND_URL=https://mercadoturismo.ar
   ```

2. **Generar JWT Secret seguro**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Estructura de archivos en el servidor**
   ```
   /home/usuario/api.mercadoturismo.ar/
   ├── app.js (entry point para Passenger)
   ├── package.json
   ├── .env (con variables de producción)
   ├── database.sqlite
   ├── src/
   │   ├── index.js
   │   ├── config/
   │   ├── controllers/
   │   ├── models/
   │   ├── routes/
   │   └── ...
   ├── uploads/ (con permisos 755)
   └── node_modules/
   ```

4. **Comandos de instalación en el servidor**
   ```bash
   cd /home/usuario/api.mercadoturismo.ar
   npm install --production
   ```

5. **Configuración de Passenger (.htaccess)**
   - Ya incluido en el proyecto
   - Passenger detecta automáticamente `app.js` como entry point

### Frontend (React + Vite)

1. **Variables de Entorno**
   - Archivo `.env.production` ya configurado con:
     ```bash
     VITE_API_URL=https://api.mercadoturismo.ar/api
     ```

2. **Build de producción**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Subir al servidor**
   - Subir el contenido de `frontend/dist/` al directorio público
   - Estructura en el servidor:
   ```
   /home/usuario/public_html/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── ...
   └── .htaccess
   ```

4. **Configuración .htaccess frontend** (ya incluido)
   ```apache
   # Reescribir todas las rutas a index.html para React Router
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## 🔍 Verificación Post-Deployment

### Backend
```bash
# Verificar que el servidor responda
curl https://api.mercadoturismo.ar/api/health

# Debería retornar:
{
  "success": true,
  "status": "OK",
  "timestamp": "...",
  "environment": "production",
  "database": "SQLite",
  "jwt": "Configurado",
  "cors": "https://mercadoturismo.ar"
}
```

### Frontend
1. Abrir https://mercadoturismo.ar
2. Verificar que la consola del navegador no muestre errores de CORS
3. Probar login/registro
4. Verificar que las imágenes se carguen correctamente

## 🔧 Troubleshooting

### Error: CORS
- Verificar que `FRONTEND_URL` en backend `.env` sea correcto
- Verificar que el frontend esté sirviendo desde el dominio correcto

### Error: 500 Internal Server Error
- Revisar logs de Passenger: `tail -f ~/api.mercadoturismo.ar/passenger.log`
- Verificar permisos de archivos y carpetas
- Verificar que `JWT_SECRET` esté configurado

### Error: No se cargan las imágenes
- Verificar permisos de la carpeta `uploads/`: `chmod 755 uploads/`
- Verificar ruta absoluta en configuración de Express
- Verificar CORS headers en `/uploads`

### Error: Base de datos
- Verificar que `database.sqlite` exista y tenga permisos de lectura/escritura
- Ejecutar migraciones si es necesario

## 📦 Actualización del Código

### Backend
```bash
cd ~/api.mercadoturismo.ar
git pull origin main
npm install --production
touch tmp/restart.txt  # Reiniciar Passenger
```

### Frontend
```bash
# En tu máquina local:
cd frontend
npm run build

# Subir dist/ al servidor via FTP/SFTP
```

## 🔐 Seguridad

- ✅ CORS configurado para dominios específicos
- ✅ Helmet activado para headers de seguridad
- ✅ Rate limiting configurado (100 req/15min por IP)
- ✅ JWT para autenticación
- ✅ Variables de entorno para secretos
- ⚠️ Backup regular de `database.sqlite`

## 📝 Notas Importantes

1. **NO subir archivos `.env` al repositorio** - Están en `.gitignore`
2. **Usar `.env.production` como plantilla** en el servidor
3. **Generar nuevo JWT_SECRET** para producción (nunca usar el de ejemplo)
4. **Hacer backup de la base de datos** regularmente:
   ```bash
   cp database.sqlite database.backup.$(date +%Y%m%d).sqlite
   ```

## 🆘 Soporte

Para problemas específicos de WNPower:
- Documentación: https://wnpower.com/docs
- Soporte: soporte@wnpower.com

---
*Última actualización: $(date)*
