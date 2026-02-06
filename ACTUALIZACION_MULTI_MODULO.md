# Actualización Multi-Módulo: Cruceros, Paquetes, Transfers y Autos

## 📋 Resumen Ejecutivo

Esta actualización extiende y ajusta los atributos, filtros y comportamiento de 4 módulos principales del sistema:

- **Cruceros**: Agregados campos para pricing diferenciado, moneda, mes de salida y puertos destino
- **Paquetes**: Agregado campo de noches, eliminados campos obsoletos de cupos
- **Transfers**: Agregados campos para tipo de servicio explícito
- **Autos**: Verificado campo transmisión (ya existía)

## 🎯 Objetivos

1. **Mejorar capacidad de búsqueda y filtrado** para usuarios finales
2. **Diferenciar precios** por tipo de pasajero (adulto/menor) en cruceros
3. **Soportar múltiples monedas** en cruceros (USD, ARS, EUR)
4. **Simplificar estructura de datos** eliminando campos obsoletos
5. **Hacer explícitos** campos que antes eran implícitos o ambiguos

---

## 🚢 MÓDULO CRUCEROS

### Campos Nuevos

| Campo            | Tipo           | Descripción                     | Uso                              |
| ---------------- | -------------- | ------------------------------- | -------------------------------- |
| `mesSalida`      | INTEGER (1-12) | Mes de salida del crucero       | Filtro por mes específico        |
| `duracionDias`   | INTEGER        | Duración en DÍAS (no noches)    | Filtro por rango de duración     |
| `puertosDestino` | JSON Array     | Puertos destino principales     | Diferente de itinerario completo |
| `moneda`         | ENUM           | 'USD', 'ARS', 'EUR'             | Multi-moneda para precios        |
| `importeAdulto`  | DECIMAL(10,2)  | Precio para pasajeros +18 años  | Pricing diferenciado             |
| `importeMenor`   | DECIMAL(10,2)  | Precio para pasajeros 0-17 años | Pricing diferenciado             |

### Campos Modificados

| Campo          | Estado       | Cambio                                                         |
| -------------- | ------------ | -------------------------------------------------------------- |
| `precioDesde`  | **OBSOLETO** | `allowNull: true` - Reemplazado por importeAdulto/importeMenor |
| `puertoSalida` | Aclarado     | Comentario: "DIFERENTE de puertos en itinerario"               |

### Lógica de Búsqueda (Controller)

**Endpoint**: `GET /api/cruceros`

**Query Params**:

```javascript
{
  puertoSalida: "Miami",        // Match EXACTO en puerto de salida
  mes: 12,                       // Filtra por mesSalida = 12
  duracionMin: 5,                // Filtra duracionDias >= 5
  duracionMax: 10,               // Filtra duracionDias <= 10
  moneda: "USD"                  // Filtra por moneda específica
}
```

**Lógica Implementada**:

```javascript
// Puerto de salida: EXACTO (no busca en itinerario)
if (puertoSalida) whereClause.puertoSalida = puertoSalida;

// Mes de salida
if (mes) whereClause.mesSalida = parseInt(mes);

// Duración en días (rango)
if (duracionMin) whereClause.duracionDias = { [Op.gte]: parseInt(duracionMin) };
if (duracionMax) whereClause.duracionDias = { [Op.lte]: parseInt(duracionMax) };

// Moneda
if (moneda) whereClause.moneda = moneda;
```

### Consideraciones Importantes

1. **Puerto de Salida vs Itinerario**:
   - `puertoSalida`: Puerto EXACTO de donde zarpa el crucero
   - `itinerario`: Todos los puertos que visita durante el viaje (JSON)
   - `puertosDestino`: Puertos principales de destino (separados de itinerario)
2. **Duración**:
   - Antes: `duracion` era ambiguo (¿días o noches?)
   - Ahora: `duracionDias` es explícito (DÍAS)

3. **Precios**:
   - `importeAdulto`: Para pasajeros de 18 años o más
   - `importeMenor`: Para pasajeros de 0 a 17 años
   - Permite ofertas diferenciadas por edad

---

## 📦 MÓDULO PAQUETES

### Campos Nuevos

| Campo    | Tipo    | Descripción                    | Uso                           |
| -------- | ------- | ------------------------------ | ----------------------------- |
| `noches` | INTEGER | Cantidad de noches del paquete | Filtro por cantidad de noches |

### Campos Modificados

| Campo            | Estado       | Cambio                           |
| ---------------- | ------------ | -------------------------------- |
| `cupoMaximo`     | **OBSOLETO** | `allowNull: true` - Ya no se usa |
| `cupoDisponible` | **OBSOLETO** | `allowNull: true` - Ya no se usa |
| `duracion`       | Aclarado     | Comentario: "Duración en días"   |

### Lógica de Búsqueda (Controller)

**Endpoint**: `GET /api/paquetes`

**Query Params**:

```javascript
{
  destino: "Paris",              // Búsqueda LIKE en destino
  nochesMin: 3,                  // Filtra noches >= 3
  nochesMax: 7,                  // Filtra noches <= 7
  precioMin: 500,                // Filtra precio >= 500
  precioMax: 2000                // Filtra precio <= 2000
}
```

**Lógica Implementada**:

```javascript
// Destino (búsqueda flexible)
if (destino) whereClause.destino = { [Op.like]: `%${destino}%` };

// Noches (rango)
if (nochesMin) whereClause.noches = { [Op.gte]: parseInt(nochesMin) };
if (nochesMax) whereClause.noches = { [Op.lte]: parseInt(nochesMax) };

// Precio (rango)
if (precioMin) whereClause.precio = { [Op.gte]: parseFloat(precioMin) };
if (precioMax) whereClause.precio = { [Op.lte]: parseFloat(precioMax) };
```

### Consideraciones Importantes

1. **Sistema de Cupos Removido**:
   - Los paquetes ya no manejan cupos limitados
   - `cupoMaximo` y `cupoDisponible` se mantienen por compatibilidad pero están obsoletos
   - Nuevos paquetes no deben usar estos campos

2. **Duración vs Noches**:
   - `duracion`: Días totales del paquete (incluye llegada y salida)
   - `noches`: Noches de alojamiento (duracion - 1)
   - Ejemplo: Paquete de 5 días = 4 noches

---

## 🚗 MÓDULO TRANSFERS

### Campos Nuevos

| Campo          | Tipo | Descripción                    | Uso                            |
| -------------- | ---- | ------------------------------ | ------------------------------ |
| `tipoServicio` | ENUM | 'privado', 'compartido'        | Tipo de servicio explícito     |
| `tipoDestino`  | ENUM | 'ciudad', 'hotel', 'direccion' | Tipo de destino para búsquedas |

### Campos Modificados

| Campo                | Estado       | Cambio                                           |
| -------------------- | ------------ | ------------------------------------------------ |
| `servicioCompartido` | **OBSOLETO** | `allowNull: true` - Reemplazado por tipoServicio |

### Lógica de Búsqueda (Controller)

**Endpoint**: `GET /api/transfers`

**Query Params**:

```javascript
{
  tipoServicio: "privado",       // Filtra por tipo de servicio
  origen: "Aeropuerto",          // Búsqueda LIKE en origen
  destino: "Hotel",              // Búsqueda LIKE en destino
  precioMin: 50,                 // Filtra precio >= 50
  precioMax: 150                 // Filtra precio <= 150
}
```

**Lógica Implementada**:

```javascript
// Tipo de servicio (exacto)
if (tipoServicio) whereClause.tipoServicio = tipoServicio;

// Origen y destino (búsqueda flexible)
if (origen) whereClause.origen = { [Op.like]: `%${origen}%` };
if (destino) whereClause.destino = { [Op.like]: `%${destino}%` };

// Precio (rango)
if (precioMin) whereClause.precio = { [Op.gte]: parseFloat(precioMin) };
if (precioMax) whereClause.precio = { [Op.lte]: parseFloat(precioMax) };
```

### Consideraciones Importantes

1. **Tipo de Servicio Explícito**:
   - Antes: `servicioCompartido: true/false` (Boolean)
   - Ahora: `tipoServicio: 'privado' | 'compartido'` (Enum más claro)

2. **Tipo de Destino**:
   - `ciudad`: Transfer a ciudad general
   - `hotel`: Transfer a hotel específico
   - `direccion`: Transfer a dirección exacta
   - Permite mejor categorización y búsqueda

---

## 🚙 MÓDULO AUTOS

### Estado

✅ **No requiere cambios en modelo** - El campo `transmision` ya existe

### Campo Existente

| Campo         | Tipo | Valores                | Estado             |
| ------------- | ---- | ---------------------- | ------------------ |
| `transmision` | ENUM | 'manual', 'automatico' | ✅ Ya implementado |

### Lógica de Búsqueda (Controller) - ACTUALIZADA

**Endpoint**: `GET /api/autos`

**Query Params**:

```javascript
{
  transmision: "automatico",     // Filtra por tipo de transmisión
  categoria: "SUV",              // Filtra por categoría
  ubicacion: "Bariloche",        // Búsqueda LIKE en ubicación
  precioMin: 100,                // Filtra precio >= 100
  precioMax: 300                 // Filtra precio <= 300
}
```

**Lógica Implementada**:

```javascript
// Transmisión (exacto)
if (transmision) whereClause.transmision = transmision;

// Categoría (exacto)
if (categoria) whereClause.categoria = categoria;

// Ubicación (búsqueda flexible)
if (ubicacion) whereClause.ubicacion = { [Op.like]: `%${ubicacion}%` };

// Precio por día (rango)
if (precioMin) whereClause.precioPorDia = { [Op.gte]: parseFloat(precioMin) };
if (precioMax) whereClause.precioPorDia = { [Op.lte]: parseFloat(precioMax) };
```

---

## 🔧 Cambios Técnicos

### Backend

#### Modelos Modificados

1. **backend/src/models/Crucero.model.js**
   - ✅ 6 campos nuevos agregados
   - ✅ 1 campo marcado como OBSOLETO

2. **backend/src/models/Paquete.model.js**
   - ✅ 1 campo nuevo agregado
   - ✅ 2 campos marcados como OBSOLETO

3. **backend/src/models/Transfer.model.js**
   - ✅ 2 campos nuevos agregados
   - ✅ 1 campo marcado como OBSOLETO

4. **backend/src/models/Auto.model.js**
   - ✅ Sin cambios (transmision ya existe)

#### Controllers Actualizados

1. **backend/src/controllers/cruceros.controller.js**
   - ✅ Agregado `const { Op } = require("sequelize");`
   - ✅ Filtros: puertoSalida, mes, duracionMin/Max, moneda
   - ✅ Console logs para debugging

2. **backend/src/controllers/paquetes.controller.js**
   - ✅ Agregado `const { Op } = require("sequelize");`
   - ✅ Filtros: destino (LIKE), nochesMin/Max, precioMin/Max
   - ✅ Console logs para debugging

3. **backend/src/controllers/transfers.controller.js**
   - ✅ Agregado `const { Op } = require("sequelize");`
   - ✅ Filtros: tipoServicio, origen (LIKE), destino (LIKE), precioMin/Max
   - ✅ Console logs para debugging

4. **backend/src/controllers/autos.controller.js**
   - ✅ Agregado `const { Op } = require("sequelize");`
   - ✅ Filtros: transmision, categoria, ubicacion (LIKE), precioMin/Max
   - ✅ Console logs para debugging

### Script de Migración

**Archivo**: `backend/src/migrate-multi-module.js`

**Funcionalidad**:

- Agrega todas las nuevas columnas a las tablas
- Modifica columnas obsoletas para permitir NULL
- Verifica existencia de columnas antes de agregarlas (idempotente)
- Incluye comentarios descriptivos en las columnas
- Muestra resumen detallado al finalizar

**Ejecución**:

```bash
cd backend
node src/migrate-multi-module.js
```

---

## 🎨 Frontend (PENDIENTE)

### Trabajo Requerido

#### 1. Cards Minorista (Vista Pública)

**Cruceros** - Actualizar card:

```jsx
// Mostrar:
- Puerto de salida (puertoSalida)
- Mes de salida (mesSalida - convertir a nombre del mes)
- Duración en días (duracionDias)
- Precio adulto/menor (importeAdulto, importeMenor)
- Moneda (moneda)

// Agregar a filtros de búsqueda:
- Select de puerto de salida
- Select de mes (1-12)
- Range de duración (días)
- Select de moneda
```

**Paquetes** - Actualizar card:

```jsx
// Mostrar:
- Cantidad de noches (noches)
- Duración en días (duracion)

// Agregar a filtros de búsqueda:
- Range de noches (min/max)
- Range de precio
- Búsqueda por destino
```

**Transfers** - Actualizar card:

```jsx
// Mostrar:
- Tipo de servicio (tipoServicio) - Badge "Privado" o "Compartido"
- Tipo de destino (tipoDestino)

// Agregar a filtros de búsqueda:
- Select tipo de servicio
- Input origen
- Input destino
- Range de precio
```

**Autos** - Actualizar card:

```jsx
// Mostrar:
- Transmisión (transmision) - Badge "Manual" o "Automático"
- Categoría

// Agregar a filtros de búsqueda:
- Select transmisión
- Select categoría
- Input ubicación
- Range de precio por día
```

#### 2. Dashboard Mayorista (Crear/Editar)

**Cruceros** - Actualizar formulario:

```jsx
<Form>
  {/* Campos existentes... */}

  <FormGroup>
    <Label>Mes de Salida</Label>
    <Select name="mesSalida">
      <option value="1">Enero</option>
      <option value="2">Febrero</option>
      {/* ... resto de meses */}
    </Select>
  </FormGroup>

  <FormGroup>
    <Label>Duración (días)</Label>
    <Input type="number" name="duracionDias" min="1" />
  </FormGroup>

  <FormGroup>
    <Label>Puertos Destino (JSON)</Label>
    <TextArea name="puertosDestino" placeholder='["Barcelona", "Roma"]' />
  </FormGroup>

  <FormGroup>
    <Label>Moneda</Label>
    <Select name="moneda">
      <option value="USD">USD</option>
      <option value="ARS">ARS</option>
      <option value="EUR">EUR</option>
    </Select>
  </FormGroup>

  <FormGroup>
    <Label>Precio Adulto (+18)</Label>
    <Input type="number" name="importeAdulto" step="0.01" />
  </FormGroup>

  <FormGroup>
    <Label>Precio Menor (0-17)</Label>
    <Input type="number" name="importeMenor" step="0.01" />
  </FormGroup>
</Form>
```

**Paquetes** - Actualizar formulario:

```jsx
<Form>
  {/* Campos existentes... */}

  <FormGroup>
    <Label>Cantidad de Noches</Label>
    <Input type="number" name="noches" min="1" />
    <FormText>Duración en días - 1</FormText>
  </FormGroup>

  {/* REMOVER o OCULTAR campos obsoletos:
      - cupoMaximo
      - cupoDisponible
  */}
</Form>
```

**Transfers** - Actualizar formulario:

```jsx
<Form>
  {/* Campos existentes... */}

  <FormGroup>
    <Label>Tipo de Servicio</Label>
    <Select name="tipoServicio">
      <option value="privado">Privado</option>
      <option value="compartido">Compartido</option>
    </Select>
  </FormGroup>

  <FormGroup>
    <Label>Tipo de Destino</Label>
    <Select name="tipoDestino">
      <option value="ciudad">Ciudad</option>
      <option value="hotel">Hotel</option>
      <option value="direccion">Dirección</option>
    </Select>
  </FormGroup>

  {/* REMOVER o OCULTAR campo obsoleto:
      - servicioCompartido
  */}
</Form>
```

**Autos** - Sin cambios necesarios:

```jsx
// El campo transmision ya existe en el formulario
// Solo verificar que esté presente
```

---

## 📊 Migración de Datos

### Estrategia

1. **Campos Nuevos**:
   - Se agregan como `allowNull: true` inicialmente
   - Completar datos manualmente o con scripts según necesidad
   - En producción: considerar valores por defecto temporales

2. **Campos OBSOLETOS**:
   - Se mantienen por compatibilidad
   - `allowNull: true` para no romper registros existentes
   - Documentar claramente que NO se deben usar en nuevos registros

### Script de Migración

**Ejecutar**:

```bash
cd backend
node src/migrate-multi-module.js
```

**Salida Esperada**:

```
🚀 Iniciando migración multi-módulo...

🚢 Actualizando tabla Cruceros...
  ✅ Agregada columna: mesSalida
  ✅ Agregada columna: duracionDias
  ✅ Agregada columna: puertosDestino
  ✅ Agregada columna: moneda
  ✅ Agregada columna: importeAdulto
  ✅ Agregada columna: importeMenor
  ✅ Actualizada columna: precioDesde (ahora nullable - OBSOLETO)
✅ Cruceros actualizado

📦 Actualizando tabla Paquetes...
  ✅ Agregada columna: noches
  ✅ Actualizada columna: cupoMaximo (ahora nullable - OBSOLETO)
  ✅ Actualizada columna: cupoDisponible (ahora nullable - OBSOLETO)
✅ Paquetes actualizado

🚗 Actualizando tabla Transfers...
  ✅ Agregada columna: tipoServicio
  ✅ Agregada columna: tipoDestino
  ✅ Actualizada columna: servicioCompartido (ahora nullable - OBSOLETO)
✅ Transfers actualizado

✨ Migración completada exitosamente!
```

---

## ✅ Checklist de Implementación

### Backend ✅ COMPLETO

- [x] Modelo Crucero actualizado con 6 campos nuevos
- [x] Modelo Paquete actualizado con campo noches
- [x] Modelo Transfer actualizado con 2 campos nuevos
- [x] Modelo Auto verificado (transmision existe)
- [x] Controller Cruceros con filtros avanzados
- [x] Controller Paquetes con filtros avanzados
- [x] Controller Transfers con filtros avanzados
- [x] Controller Autos con filtros avanzados
- [x] Script de migración de base de datos creado

### Frontend ⏳ PENDIENTE

- [ ] Card de Cruceros actualizada (minorista)
- [ ] Card de Paquetes actualizada (minorista)
- [ ] Card de Transfers actualizada (minorista)
- [ ] Card de Autos actualizada (minorista)
- [ ] Filtros de búsqueda Cruceros (minorista)
- [ ] Filtros de búsqueda Paquetes (minorista)
- [ ] Filtros de búsqueda Transfers (minorista)
- [ ] Filtros de búsqueda Autos (minorista)
- [ ] Formulario Cruceros (dashboard mayorista)
- [ ] Formulario Paquetes (dashboard mayorista)
- [ ] Formulario Transfers (dashboard mayorista)
- [ ] Formulario Autos verificado (dashboard mayorista)

### Base de Datos ⏳ PENDIENTE

- [ ] Ejecutar script de migración en desarrollo
- [ ] Verificar todas las columnas agregadas
- [ ] Actualizar datos existentes según sea necesario
- [ ] Ejecutar migración en producción (cuando esté listo)

---

## 🚨 Consideraciones Importantes

### Backward Compatibility

Los campos marcados como **OBSOLETO** se mantienen para no romper datos existentes:

- `Cruceros.precioDesde`
- `Paquetes.cupoMaximo`
- `Paquetes.cupoDisponible`
- `Transfers.servicioCompartido`

**NO eliminarlos**, solo evitar usarlos en nuevos registros.

### Validaciones Frontend

Al crear/editar registros en el dashboard, validar:

1. **Cruceros**:
   - `mesSalida` debe estar entre 1 y 12
   - `duracionDias` debe ser > 0
   - `moneda` debe ser USD, ARS o EUR
   - `importeAdulto` e `importeMenor` deben ser >= 0

2. **Paquetes**:
   - `noches` debe ser >= 1
   - `noches` = `duracion` - 1 (típicamente)

3. **Transfers**:
   - `tipoServicio` debe ser 'privado' o 'compartido'
   - `tipoDestino` debe ser 'ciudad', 'hotel' o 'direccion'

### Performance

Los nuevos filtros usan operadores de Sequelize:

- `Op.like`: Para búsquedas flexibles (puede ser lento en tablas grandes)
- `Op.gte` / `Op.lte`: Para rangos (muy eficiente)

**Recomendaciones**:

- Agregar índices en columnas filtradas frecuentemente:
  ```sql
  CREATE INDEX idx_cruceros_mes ON Cruceros(mesSalida);
  CREATE INDEX idx_cruceros_moneda ON Cruceros(moneda);
  CREATE INDEX idx_paquetes_noches ON Paquetes(noches);
  CREATE INDEX idx_transfers_tipo_servicio ON Transfers(tipoServicio);
  CREATE INDEX idx_autos_transmision ON Autos(transmision);
  ```

---

## 📚 Documentación Adicional

### Ejemplos de Uso API

**Buscar cruceros por puerto y mes**:

```javascript
GET /api/cruceros?puertoSalida=Miami&mes=12&moneda=USD
```

**Buscar paquetes de 3-5 noches en París**:

```javascript
GET /api/paquetes?destino=Paris&nochesMin=3&nochesMax=5
```

**Buscar transfers privados**:

```javascript
GET /api/transfers?tipoServicio=privado&origen=Aeropuerto
```

**Buscar autos automáticos en Bariloche**:

```javascript
GET /api/autos?transmision=automatico&ubicacion=Bariloche
```

### Estructura JSON de puertosDestino

```json
{
  "puertosDestino": ["Barcelona", "Roma", "Atenas"]
}
```

---

## 🎯 Próximos Pasos

1. **Ejecutar migración** en base de datos de desarrollo
2. **Actualizar componentes frontend** según checklist
3. **Probar filtros** en cada módulo
4. **Completar datos** de registros existentes
5. **Documentar** para el equipo los nuevos campos
6. **Ejecutar migración** en producción

---

## 📝 Notas de Versión

**Versión**: 2.0.0  
**Fecha**: 2024  
**Autor**: Sistema Multi-Módulo  
**Módulos Afectados**: Cruceros, Paquetes, Transfers, Autos

**Breaking Changes**: Ninguno (todos los cambios son backward compatible)

**Deprecations**:

- `Cruceros.precioDesde` → Usar `importeAdulto` / `importeMenor`
- `Paquetes.cupoMaximo` → Campo obsoleto
- `Paquetes.cupoDisponible` → Campo obsoleto
- `Transfers.servicioCompartido` → Usar `tipoServicio`
