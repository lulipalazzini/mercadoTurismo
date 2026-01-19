# Cambios en la Base de Datos - Vendedores

## ✅ Cambios Implementados

### 1. **Campo `razonSocial` en Usuario**

Se agregó el campo `razonSocial` al modelo `User` para identificar la razón social de vendedores:

```javascript
razonSocial: {
  type: DataTypes.STRING,
  allowNull: true,
  comment: "Razón social del vendedor (para operadores y agencias)",
}
```

**Usuarios actualizados en seeder:**
- Admin: "Mercado Turismo S.A."
- Agencia: "Viajes Premier S.A."
- Operador Independiente: "María López - Operador Turístico"

---

### 2. **Campo `vendedorId` en Todos los Servicios**

Se agregó el campo `vendedorId` a **todos** los modelos de servicios/productos:

#### Modelos actualizados:
- ✅ `Alojamiento` - Hoteles, hostels, apartamentos, etc.
- ✅ `Pasaje` - Vuelos y transportes terrestres
- ✅ `Auto` - Alquiler de vehículos
- ✅ `Excursion` - Tours y excursiones
- ✅ `Crucero` - Viajes marítimos
- ✅ `Circuito` - Circuitos turísticos
- ✅ `Paquete` - Paquetes turísticos
- ✅ `Transfer` - Transfers y traslados
- ✅ `Seguro` - Seguros de viaje
- ✅ `SalidaGrupal` - Salidas grupales

#### Estructura del campo:
```javascript
vendedorId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'Users',
    key: 'id'
  },
  comment: "ID del vendedor que publicó este [servicio]",
}
```

---

### 3. **Seeders Actualizados**

#### Usuarios:
- **ID 1**: Admin (Mercado Turismo S.A.)
- **ID 2**: Agencia (Viajes Premier S.A.)
- **ID 3**: Operador Agencia (Juan García)
- **ID 4**: Operador Independiente (María López - Operador Turístico)

#### Servicios de ejemplo con vendedorId:
- Hotel Sheraton → vendedorId: 2 (Agencia)
- Vuelo AR1680 (BUE-BRC) → vendedorId: 2 (Agencia)
- Vuelo LA4120 (BUE-USH) → vendedorId: 4 (Operador Independiente)
- Vuelo FO5210 (BUE-MDZ) → vendedorId: 2 (Agencia)

---

## 📊 Uso de los Nuevos Campos

### Para obtener servicios con información del vendedor:

```javascript
// Ejemplo: Obtener alojamientos con datos del vendedor
const alojamientos = await Alojamiento.findAll({
  include: [{
    model: User,
    as: 'vendedor',
    attributes: ['id', 'nombre', 'email', 'razonSocial', 'role']
  }]
});
```

### Para filtrar servicios por vendedor:

```javascript
// Ejemplo: Obtener todos los servicios de un vendedor específico
const serviciosVendedor = await Alojamiento.findAll({
  where: { vendedorId: 2 }
});
```

---

## 🔄 Base de Datos

- ✅ Base de datos recreada con los nuevos campos
- ✅ Seeders ejecutados exitosamente
- ✅ Datos de prueba cargados
- ✅ Relaciones configuradas

---

## 📝 Próximos Pasos Sugeridos

1. **Agregar relaciones explícitas** en los modelos para hacer queries más fáciles
2. **Actualizar controladores** para incluir información del vendedor
3. **Crear endpoints** para filtrar por vendedor
4. **Agregar validaciones** para que solo el vendedor pueda editar sus servicios
5. **Dashboard de vendedor** mostrando sus publicaciones

---

**Fecha:** Enero 2026  
**Estado:** ✅ Completado
