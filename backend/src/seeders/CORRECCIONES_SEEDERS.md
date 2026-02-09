# Correcciones Aplicadas a los Seeders

## Fecha: 9 de febrero de 2026

### Resumen de Problemas Encontrados y Corregidos

Se identificaron **discrepancias sistemáticas** entre los campos definidos en los seeders y los campos requeridos por los modelos de Sequelize. Estas inconsistencias causaban errores de `NOT NULL constraint failed` al intentar ejecutar los seeders.

---

## 🔧 Correcciones Realizadas

### 1. **Campo `noches` faltante en Paquetes**
- **Archivo**: `paquetes.seeder.js`
- **Problema**: El modelo `Paquete` requiere el campo `noches` (allowNull: false), pero los datos del seeder no lo incluían
- **Solución**: Agregado cálculo automático `noches = duracion - 1` a todos los paquetes
- **Resultado**: ✅ 15 paquetes creados exitosamente

### 2. **Campo `published_by_user_id` faltante en 11 modelos**
- **Archivos afectados**:
  - `alojamientos.seeder.js`
  - `autos.seeder.js`
  - `circuitos.seeder.js`
  - `cruceros.seeder.js`
  - `cuposMercado.seeder.js`
  - `excursiones.seeder.js`
  - `paquetes.seeder.js`
  - `salidasGrupales.seeder.js`
  - `seguros.seeder.js`
  - `transfers.seeder.js`
- **Problema**: Campo de seguridad obligatorio `published_by_user_id` (allowNull: false) ausente en todos los seeders
- **Solución**: Agregada lógica de mapeo `.map(item => ({ ...item, published_by_user_id: 1 }))` en todas las funciones de seed
- **Resultado**: ✅ Todas las publicaciones asignadas al usuario admin (id: 1)

### 3. **Campos calculados faltantes en Cruceros**
- **Archivo**: `cruceros.seeder.js`
- **Problema**: 4 campos obligatorios ausentes:
  - `mesSalida` (INTEGER)
  - `duracionDias` (INTEGER)
  - `importeAdulto` (DECIMAL)
  - `importeMenor` (DECIMAL)
- **Solución**: Agregada lógica de cálculo automático:
  ```javascript
  mesSalida: crucero.fechaSalida.getMonth() + 1,
  duracionDias: crucero.duracion + 1,
  importeAdulto: crucero.precioDesde,
  importeMenor: crucero.precioDesde * 0.5
  ```
- **Resultado**: ✅ 15 cruceros creados exitosamente

### 4. **Campos específicos de aerolínea en CuposMercado**
- **Archivo**: `cuposMercado.seeder.js`
- **Problema**: 2 campos obligatorios ausentes:
  - `fechaOrigen` (DATE)
  - `aerolinea` (STRING)
- **Solución**: Extracción automática desde descripción con regex + asignación inteligente de aerolínea según destino
- **Resultado**: ✅ 8 cupos de mercado creados exitosamente

### 5. **Discrepancia `disponible` vs `activo`**
- **Archivos afectados**:
  - `alojamientos.seeder.js` → ✅ 15 registros
  - `circuitos.seeder.js` → ✅ 6 registros
  - `excursiones.seeder.js` → ✅ 11 registros
  - `paquetes.seeder.js` → ✅ 15 registros
  - `salidasGrupales.seeder.js` → ✅ 10 registros
  - `seguros.seeder.js` → ✅ 15 registros
- **Problema**: Los seeders usaban `disponible: true`, pero los modelos definen el campo como `activo`
- **Solución**: Reemplazo global con `sed`:
  ```bash
  sed -i 's/disponible: true,/activo: true,/g' alojamientos.seeder.js circuitos.seeder.js excursiones.seeder.js paquetes.seeder.js seguros.seeder.js
  ```
- **Nota**: Los modelos `Auto` y `Transfer` SÍ usan `disponible`, por lo que NO fueron modificados
- **Resultado**: ✅ 6 seeders corregidos

### 6. **Campos incorrectos en SalidasGrupales**
- **Archivo**: `salidasGrupales.seeder.js`
- **Problemas**:
  - Campo `coordinador` no existe en modelo → debe ser `acompañante`
  - Campo `edadMinima` no existe en modelo (solo existe en Excursion y Seguro)
  - Campo `disponible` debe ser `activo`
- **Solución**: Triple corrección con `sed`:
  ```bash
  sed -i 's/coordinador:/acompañante:/g' salidasGrupales.seeder.js
  sed -i '/edadMinima:/d' salidasGrupales.seeder.js
  sed -i 's/disponible: true,/activo: true,/g' salidasGrupales.seeder.js
  ```
- **Resultado**: ✅ 10 salidas grupales creadas exitosamente

---

## ✅ Estado Final

**Todos los seeders ejecutan sin errores:**

| Seeder | Registros Creados | Estado |
|--------|------------------|--------|
| Users | 4 usuarios | ✅ |
| Clientes | 15 clientes | ✅ |
| Paquetes | 15 paquetes | ✅ |
| Alojamientos | 15 alojamientos | ✅ |
| Autos | 15 autos | ✅ |
| Excursiones | 11 excursiones | ✅ |
| Transfers | 15 transfers | ✅ |
| Seguros | 15 seguros | ✅ |
| Cruceros | 15 cruceros | ✅ |
| Circuitos | 6 circuitos | ✅ |
| Salidas Grupales | 10 salidas | ✅ |
| Cupos Mercado | 8 cupos | ✅ |
| Click Stats | 10 categorías | ✅ |

**Total**: 13 seeders, 154+ registros insertados exitosamente

---

## 📋 Modelos de Campos por Entidad

### Modelos que usan `activo: BOOLEAN`
- Alojamiento
- Circuito
- Crucero
- Excursion
- Paquete
- SalidaGrupal
- Seguro

### Modelos que usan `disponible: BOOLEAN`
- Auto
- Transfer

### Campos Universales Obligatorios
Todos los modelos de servicios/productos requieren:
- `published_by_user_id: INTEGER NOT NULL` (control de seguridad)
- `vendedorId: INTEGER` (opcional, referencia a vendedor)
- `userId: INTEGER` (opcional, para ownership B2B)
- `destacado: BOOLEAN` (default: false)
- `timestamps: true` (createdAt, updatedAt)

---

## 🔍 Validaciones Realizadas

1. ✅ `npm run seed` ejecuta sin errores
2. ✅ Todos los registros se insertan correctamente
3. ✅ No hay campos faltantes con constraint NOT NULL
4. ✅ Campos calculados (mesSalida, duracionDias, etc.) funcionan correctamente
5. ✅ Extracción de datos desde descripciones (fechaOrigen, aerolinea) opera correctamente
6. ✅ Mapeo de `published_by_user_id` asigna correctamente al usuario admin

---

## 🚀 Comandos para Ejecutar

### Resetear y sembrar la base de datos
```bash
cd backend
npm run seed
```

### Verificar conteo de registros
```bash
sqlite3 database.sqlite "SELECT 'Paquetes:', COUNT(*) FROM Paquetes UNION ALL SELECT 'Alojamientos:', COUNT(*) FROM alojamientos;"
```

---

## 📝 Notas Importantes

1. **Integridad Referencial**: Todos los seeders respetan el orden de dependencias (Users → Clientes → Servicios)
2. **Seguridad**: El campo `published_by_user_id` garantiza que cada publicación tiene un propietario
3. **Backward Compatibility**: Los campos antiguos como `servicioCompartido` (Transfer) y `precioDesde` (Crucero) se mantienen aunque están marcados como obsoletos
4. **Performance**: El uso de `bulkCreate` permite insertar múltiples registros en una sola operación SQL

---

**Última actualización**: 9 de febrero de 2026  
**Ejecutado por**: GitHub Copilot (Claude Sonnet 4.5)
