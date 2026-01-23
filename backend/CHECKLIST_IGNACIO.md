# ✅ CHECKLIST PARA IGNACIO - DEPLOY WNPOWER

## 📋 Lo Que Se Hizo (Ya Completado)

- [x] ✅ Identificado el problema: ERR_REQUIRE_ESM
- [x] ✅ Eliminado `"type": "module"` de package.json
- [x] ✅ Convertido app.js a CommonJS (require en lugar de import)
- [x] ✅ Convertido 50+ archivos automáticamente (modelos, rutas, controladores)
- [x] ✅ Probado localmente - funciona perfectamente
- [x] ✅ Creada documentación completa

## 🎯 Lo Que Tienes Que Hacer

### 1. Revisar Localmente (5 minutos)

```bash
# Ir a la carpeta del backend
cd c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\backend

# Ejecutar verificación (opcional pero recomendado)
node verify-pre-deploy.js

# Debería mostrar: ✅ ¡TODO PERFECTO! Listo para deploy
```

### 2. Subir Cambios a GitHub (5 minutos)

```bash
# Agregar todos los cambios
git add backend/

# Hacer commit
git commit -m "Fix: Convertir backend de ESM a CommonJS para WNPower/Passenger"

# Subir a GitHub
git push origin main
```

### 3. Deploy en WNPower (10 minutos)

#### A. Conectar al servidor por SSH
```bash
# Usar tu cliente SSH favorito (PuTTY, terminal, etc.)
ssh usuario@mercadoturismo.ar
```

#### B. Actualizar el código
```bash
# Ir a la carpeta de tu aplicación
cd ~/mercad25.mercadoturismo.ar/backend

# Hacer backup (por si acaso)
cp -r . ../backend-backup-$(date +%Y%m%d)

# Traer los cambios de GitHub
git pull origin main

# Instalar/actualizar dependencias
npm install

# Reiniciar la aplicación
touch tmp/restart.txt
```

### 4. Verificar en Panel WNPower (5 minutos)

1. **Ir a cPanel → Setup Node.js App**

2. **Verificar configuración:**
   ```
   Application root:      mercad25.mercadoturismo.ar/backend
   Application URL:       mercad25.mercadoturismo.ar
   Application startup:   app.js    ← IMPORTANTE
   Node.js version:       18.x o 20.x (la que tengas)
   ```

3. **Verificar Variables de Entorno:**
   - `JWT_SECRET` = tu secreto
   - `FRONTEND_URL` = https://mercadoturismo.ar
   - `NODE_ENV` = production
   - `PORT` = (dejar vacío, Passenger lo asigna)

4. **Click en "Restart"**

### 5. Probar que Funciona (5 minutos)

#### A. Ver los logs
```bash
# En SSH, ver logs en tiempo real
tail -f ~/logs/mercad25.mercadoturismo.ar.error_log
```

**Deberías ver:**
```
✅ [PASSENGER] Aplicación iniciada correctamente
✅ SERVIDOR INICIADO CORRECTAMENTE
✅ [DATABASE] SQLite conectado exitosamente
```

**NO deberías ver:**
```
❌ ERR_REQUIRE_ESM    ← Este error ya no debería aparecer
```

#### B. Probar la API desde tu navegador

1. **Probar endpoint raíz:**
   - Abre: https://mercad25.mercadoturismo.ar/
   - Deberías ver: `{"message":"API Mercado Turismo","version":"1.0.0",...}`

2. **Probar endpoint API:**
   - Abre: https://mercad25.mercadoturismo.ar/api
   - Deberías ver: `{"message":"API Mercado Turismo funcionando"}`

3. **Probar desde el frontend:**
   - Abre tu frontend: https://mercadoturismo.ar
   - Intenta hacer login o ver productos
   - Todo debería funcionar normalmente

## 📞 Si Algo Sale Mal

### Problema: Sigue apareciendo ERR_REQUIRE_ESM

**Solución:**
```bash
# Verificar que NO exista "type": "module"
cat package.json | grep "type"

# Si aparece, editarlo y eliminarlo
nano package.json
# Eliminar la línea: "type": "module",
# Guardar: Ctrl+O, Enter, Ctrl+X

# Reiniciar
touch tmp/restart.txt
```

### Problema: Cannot find module

**Solución:**
```bash
cd ~/mercad25.mercadoturismo.ar/backend
rm -rf node_modules package-lock.json
npm install
touch tmp/restart.txt
```

### Problema: 502 Bad Gateway

**Solución:**
```bash
# Ver qué dice el log
tail -50 ~/logs/mercad25.mercadoturismo.ar.error_log

# Reiniciar la app
cd ~/mercad25.mercadoturismo.ar/backend
touch tmp/restart.txt

# Si sigue sin funcionar, verificar en Panel Node.js Apps
```

### Problema: La API responde pero el frontend no se conecta

**Solución:**
1. Verificar CORS en variables de entorno (FRONTEND_URL)
2. Verificar que el frontend apunte a la URL correcta del backend
3. Ver logs del navegador (F12 → Console)

## 📚 Documentación de Referencia

Si necesitas más detalles, tenés estos archivos:

1. **[DEPLOY_FINAL.md](./DEPLOY_FINAL.md)**
   - Guía paso a paso completa
   - Troubleshooting detallado
   - Comandos adicionales

2. **[SOLUCION_ERR_REQUIRE_ESM.md](./SOLUCION_ERR_REQUIRE_ESM.md)**
   - Explicación técnica del problema
   - Qué archivos se cambiaron
   - Antes y después

3. **[RESUMEN_VISUAL.md](./RESUMEN_VISUAL.md)**
   - Resumen con diagramas
   - Estadísticas de cambios
   - Explicación visual

4. **[README.md](./README.md)**
   - Documentación general del backend
   - Cómo usar la API
   - Scripts disponibles

## ⏱️ Tiempo Estimado Total: 30 minutos

- Revisión local: 5 min
- Subir a GitHub: 5 min
- Deploy en WNPower: 10 min
- Verificar en panel: 5 min
- Probar que funciona: 5 min

## ✅ Checklist Final

Una vez que hagas todo, marca:

- [ ] Código subido a GitHub
- [ ] `git pull` ejecutado en servidor
- [ ] `npm install` ejecutado en servidor
- [ ] `touch tmp/restart.txt` ejecutado
- [ ] Panel WNPower verificado (entry point = app.js)
- [ ] Variables de entorno configuradas
- [ ] Logs revisados (sin errores ERR_REQUIRE_ESM)
- [ ] API responde en https://mercad25.mercadoturismo.ar/
- [ ] API responde en https://mercad25.mercadoturismo.ar/api
- [ ] Frontend puede conectarse al backend
- [ ] Puedo hacer login/ver productos

## 🎉 Cuando Todo Funcione

¡Felicitaciones! El problema ERR_REQUIRE_ESM está resuelto y tu aplicación está corriendo en producción.

Mandame un mensaje confirmando que todo funciona 👍

---

**Fecha:** 23 de Enero 2026  
**Preparado por:** GitHub Copilot  
**Para:** Ignacio (lulip)  
**Proyecto:** Mercado Turismo
