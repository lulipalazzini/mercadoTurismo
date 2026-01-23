# 🚀 DEPLOY A WNPOWER - GUÍA RÁPIDA

## ✅ Estado Actual
- ✅ Código convertido de ESM a CommonJS
- ✅ 50 archivos actualizados automáticamente
- ✅ Probado localmente con éxito
- ✅ Compatible con Phusion Passenger

## 📦 PASO 1: Preparar archivos para subir

### Archivos modificados (subir todos):
```
backend/
├── package.json                    ← SIN "type": "module"
├── app.js                          ← Entry point con require()
├── convert-to-commonjs.js          ← Script de conversión (opcional)
├── SOLUCION_ERR_REQUIRE_ESM.md     ← Documentación
├── src/
    ├── index.js                    ← Convertido a CommonJS
    ├── config/
    │   └── database.js             ← Convertido a CommonJS
    ├── models/                     ← 15 archivos convertidos
    ├── routes/                     ← 17 archivos convertidos
    ├── controllers/                ← 17 archivos convertidos
    └── middleware/                 ← 1 archivo convertido
```

### ⚠️ NO subir:
- `node_modules/` (se instalan en el servidor)
- `.env` (configurar en WNPower)
- `database.sqlite` (opcional, según necesites)

## 🔧 PASO 2: Subir al servidor WNPower

### Opción A: Git (RECOMENDADO)
```bash
# En tu máquina local
cd c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo

# Agregar cambios
git add backend/

# Commit
git commit -m "Fix: Convertir backend de ESM a CommonJS para WNPower/Passenger"

# Push
git push origin main
```

```bash
# En el servidor WNPower (SSH o terminal)
cd ~/mercad25.mercadoturismo.ar/backend
git pull origin main
npm install
touch tmp/restart.txt
```

### Opción B: FTP/SFTP
1. Conectar con FileZilla o similar
2. Subir TODA la carpeta `backend/` (excepto node_modules)
3. Conectar por SSH y ejecutar:
```bash
cd ~/mercad25.mercadoturismo.ar/backend
npm install
touch tmp/restart.txt
```

### Opción C: cPanel File Manager
1. Abrir File Manager en cPanel
2. Navegar a `mercad25.mercadoturismo.ar/backend`
3. Subir archivos uno por uno o en ZIP
4. Usar Terminal en cPanel:
```bash
cd ~/mercad25.mercadoturismo.ar/backend
npm install
touch tmp/restart.txt
```

## ⚙️ PASO 3: Configurar en WNPower

### 1. Acceder al Panel de Node.js Apps
- cPanel → Software → Setup Node.js App

### 2. Verificar/Editar la aplicación existente:
```
Application root:     mercad25.mercadoturismo.ar/backend
Application URL:      mercad25.mercadoturismo.ar
Application startup:  app.js                    ← VERIFICAR
Node.js version:      18.x o 20.x               ← VERIFICAR
```

### 3. Variables de Entorno (Environment Variables)
Agregar o verificar:
```
JWT_SECRET=tu_secreto_super_seguro_aqui
FRONTEND_URL=https://mercadoturismo.ar
NODE_ENV=production
PORT=                                            ← Dejar vacío (Passenger lo asigna)
```

### 4. Guardar y Reiniciar
- Clic en "Save" o "Update"
- Clic en "Restart" o ejecutar: `touch tmp/restart.txt`

## 🔍 PASO 4: Verificar el Deploy

### 1. Ver logs en tiempo real (SSH):
```bash
cd ~/mercad25.mercadoturismo.ar/backend
tail -f logs/passenger.log
# o
tail -f ~/logs/mercad25.mercadoturismo.ar.error_log
```

### 2. Verificar que arrancó correctamente:
Deberías ver en los logs:
```
✅ [PASSENGER] Aplicación iniciada correctamente
✅ SERVIDOR INICIADO CORRECTAMENTE
✅ [DATABASE] SQLite conectado exitosamente
```

### 3. Probar la API:
```bash
# Desde tu navegador o terminal
curl https://mercad25.mercadoturismo.ar/
curl https://mercad25.mercadoturismo.ar/api

# Respuesta esperada:
# {"message":"API Mercado Turismo","version":"1.0.0",...}
```

## 🚨 TROUBLESHOOTING

### Error: "Cannot find module"
```bash
# Instalar dependencias
cd ~/mercad25.mercadoturismo.ar/backend
npm install
touch tmp/restart.txt
```

### Error: ERR_REQUIRE_ESM persiste
```bash
# Verificar que NO exista "type": "module"
cat package.json | grep "type"

# Si aparece, editar y eliminar esa línea
nano package.json
# Guardar, salir y reiniciar
touch tmp/restart.txt
```

### Error: 502 Bad Gateway
```bash
# Ver logs de error
tail -50 ~/logs/mercad25.mercadoturismo.ar.error_log

# Reiniciar la app
cd ~/mercad25.mercadoturismo.ar/backend
touch tmp/restart.txt
```

### Error: Permission denied
```bash
# Arreglar permisos
cd ~/mercad25.mercadoturismo.ar/backend
chmod 644 *.js
chmod 644 src/**/*.js
chmod 755 src/
chmod 755 src/*/
touch tmp/restart.txt
```

### La app no arranca
```bash
# Probar manualmente
cd ~/mercad25.mercadoturismo.ar/backend
node app.js

# Si funciona manualmente pero no con Passenger:
# Verificar configuración en Panel Node.js Apps
```

## ✅ Checklist Final

- [ ] Código subido al servidor
- [ ] `npm install` ejecutado
- [ ] Variables de entorno configuradas en WNPower
- [ ] Entry point es `app.js`
- [ ] NO existe `"type": "module"` en package.json
- [ ] Aplicación reiniciada con `touch tmp/restart.txt`
- [ ] Logs verificados (sin errores ERR_REQUIRE_ESM)
- [ ] API responde correctamente en `/` y `/api`
- [ ] Frontend puede conectarse al backend

## 📞 Soporte

Si después de seguir todos los pasos sigue sin funcionar:

1. **Copiar los logs completos:**
```bash
tail -100 ~/logs/mercad25.mercadoturismo.ar.error_log > error.log
tail -100 ~/mercad25.mercadoturismo.ar/backend/logs/passenger.log > passenger.log
```

2. **Compartir:**
   - Los logs copiados
   - Captura del Panel Node.js Apps
   - Versión de Node.js en el servidor

---

**Última actualización:** 23 de Enero 2026  
**Estado:** ✅ LISTO PARA DEPLOY
