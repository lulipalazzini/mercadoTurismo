# Seeders - Mercado Turismo

Este directorio contiene los seeders para poblar la base de datos con datos de ejemplo.

## 📋 Características

- **Seeders condicionales**: Solo insertan datos si las tablas están vacías
- **Datos realistas**: Información coherente y representativa para cada modelo
- **Fácil ejecución**: Script único para ejecutar todos los seeders

## 🗂️ Estructura

```
seeders/
├── index.js                    # Archivo principal que ejecuta todos los seeders
├── users.seeder.js            # 3 usuarios (1 admin, 2 users)
├── clientes.seeder.js         # 15 clientes
├── alojamientos.seeder.js     # 15 alojamientos (hoteles, hostels, etc.)
├── autos.seeder.js            # 15 autos de alquiler
├── paquetes.seeder.js         # 15 paquetes turísticos

├── excursiones.seeder.js      # 15 excursiones
├── transfers.seeder.js        # 15 servicios de transfer
├── seguros.seeder.js          # 15 seguros de viaje
├── cruceros.seeder.js         # 15 cruceros
├── circuitos.seeder.js        # 15 circuitos turísticos
├── salidasGrupales.seeder.js  # 15 salidas grupales
└── cupos.seeder.js            # 15 registros de cupos
```

## 🚀 Uso

### Ejecutar todos los seeders

```bash
# Desde la carpeta backend
npm run seed

# O ejecutar directamente
node src/seeders/index.js
```

### Ejecución condicional

Los seeders verifican automáticamente si ya existen datos en cada tabla:

- ✅ **Tabla vacía**: Inserta los datos de ejemplo
- ⏭️ **Tabla con datos**: Salta la inserción

Ejemplo de salida:

```
🌱 Iniciando seeders...

✅ Conexión a la base de datos establecida

✅ Usuarios creados exitosamente
✅ Clientes creados exitosamente
⏭️  Paquetes ya existen en la base de datos. Saltando...
✅ Alojamientos creados exitosamente
...

✨ Todos los seeders se ejecutaron exitosamente
```

## 📊 Datos incluidos

### Usuarios (3 registros)

- 1 administrador
- 2 usuarios regulares
- Contraseñas hasheadas con bcrypt

### Clientes (15 registros)

- Datos completos: nombre, email, teléfono, DNI, etc.
- Fechas de nacimiento variadas
- Todos argentinos para consistencia

### Alojamientos (15 registros)

- Diferentes tipos: hotel, hostel, resort, apartamento, cabaña
- Ubicaciones variadas en Argentina
- Rangos de precio desde $2,800 hasta $45,000 por noche
- Estrellas de 1 a 5

### Autos (15 registros)

- Marcas: Toyota, Chevrolet, Ford, Volkswagen, etc.
- Categorías: económico, compacto, sedan, SUV, lujo, van
- Transmisión manual y automática
- Ubicaciones en diferentes ciudades

### Paquetes (15 registros)

- Destinos variados por toda Argentina
- Duraciones de 3 a 10 días
- Precios desde $38,000 hasta $180,000
- Incluye fechas y cupos

### Pasajes (15 registros)

- Aéreos y terrestres
- Aerolíneas: Aerolíneas Argentinas, LATAM, Flybondi, etc.
- Rutas principales de Argentina
- Clases económica y ejecutiva

### Excursiones (15 registros)

- Tipos: cultural, aventura, naturaleza, gastronómica, deportiva
- Duraciones de 2 a 14 horas
- Niveles de dificultad: fácil, moderado, difícil
- Cupos de 8 a 50 personas

### Transfers (15 registros)

- Tipos: aeropuerto-hotel, hotel-aeropuerto, interhotel, punto-a-punto
- Vehículos: sedan, van, minibus, bus
- Servicios privados y compartidos
- Precios desde $4,500 hasta $25,000

### Seguros (15 registros)

- Tipos: viaje, médico, cancelación, equipaje, asistencia, integral
- Aseguradoras: Assist Card, Universal Assistance, Travel Ace, etc.
- Coberturas variadas
- Precios desde $1,200 hasta $15,000

### Cruceros (15 registros)

- Destinos: Caribe, Mediterráneo, Alaska, Fiordos, Patagonia, etc.
- Navieras: Royal Caribbean, MSC, Norwegian, etc.
- Duraciones de 4 a 14 noches
- Diferentes tipos de cabinas

### Circuitos (15 registros)

- Circuitos por toda Argentina
- Duraciones de 5 a 20 días
- Niveles de dificultad variados
- Incluye itinerarios detallados

### Salidas Grupales (15 registros)

- Viajes de egresados, aventura, culturales
- Diferentes destinos
- Cupos mínimos y máximos
- Coordinadores especializados

### Cupos (15 registros)

- Relacionados con diferentes servicios
- Estados: disponible, limitado, agotado
- Seguimiento de reservas
- Precios ajustados por fecha

## 🔧 Personalización

Para modificar los datos de ejemplo, edita directamente cada archivo seeder:

```javascript
// Ejemplo: agregar más alojamientos en alojamientos.seeder.js
const alojamientosData = [
  {
    nombre: "Tu Hotel",
    tipo: "hotel",
    ubicacion: "Tu Ciudad",
    // ... más campos
  },
  // ... más registros
];
```

## ⚠️ Importante

- Los seeders deben ejecutarse **después** de crear las tablas (sync o migrations)
- Las contraseñas de usuarios de ejemplo son **solo para desarrollo**
- En producción, usa datos reales o genera datos con herramientas específicas

## 🔄 Resetear datos

Si necesitas limpiar y volver a poblar la base de datos:

```bash
# Opción 1: Eliminar la base de datos y volver a crearla
# Luego ejecutar los seeders

# Opción 2: Truncar tablas manualmente y ejecutar seeders
```

## 📝 Notas

- Los IDs son auto-incrementales y los asigna la base de datos
- Las fechas de ejemplo están en el año 2026 para simular futuros viajes
- Los precios son en pesos argentinos (valores de ejemplo)
- Algunos modelos tienen relaciones, asegúrate de ejecutarlos en orden
