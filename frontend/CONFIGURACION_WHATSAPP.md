# Configuración de WhatsApp para Reservas

## 📱 Funcionalidad

Todos los servicios minoristas (alojamientos, vuelos, autos, excursiones, cruceros, circuitos, paquetes, transfers, seguros y salidas grupales) ahora incluyen un botón "Reservar" que abre WhatsApp con un mensaje pre-cargado.

## 🔧 Configuración del Número

### Paso 1: Editar el Archivo de Utilidades

Abre el archivo: `frontend/src/utils/whatsapp.js`

### Paso 2: Cambiar el Número

Busca la línea que dice:

```javascript
const WHATSAPP_NUMBER = "5491112345678";
```

Reemplázala con tu número de WhatsApp en formato internacional:

```javascript
const WHATSAPP_NUMBER = "TU_NUMERO_AQUI";
```

### 📝 Formato del Número

El número debe estar en formato internacional **sin espacios, guiones ni signos**:

- **✅ Correcto**: `5491112345678` (Argentina)
- **✅ Correcto**: `34612345678` (España)
- **✅ Correcto**: `525512345678` (México)
- **❌ Incorrecto**: `+54 911 1234-5678`
- **❌ Incorrecto**: `(54) 911-123-4567`

### Estructura del Formato:
```
[Código País][Código Área sin 0][Número]
```

**Ejemplos por país:**

| País | Código | Ejemplo Original | Formato Correcto |
|------|--------|-----------------|------------------|
| Argentina | 54 | +54 9 11 1234-5678 | `5491112345678` |
| España | 34 | +34 612 345 678 | `34612345678` |
| México | 52 | +52 55 1234 5678 | `525512345678` |
| Colombia | 57 | +57 300 123 4567 | `573001234567` |
| Chile | 56 | +56 9 1234 5678 | `56912345678` |
| Estados Unidos | 1 | +1 (555) 123-4567 | `15551234567` |

## 🎯 Cómo Funciona

1. El usuario hace clic en el botón "Reservar" de cualquier servicio
2. Se genera automáticamente un mensaje con los detalles del servicio
3. Se abre WhatsApp Web o la app (según el dispositivo)
4. El mensaje viene pre-cargado listo para enviar

## 📨 Formato de Mensajes

Cada tipo de servicio genera un mensaje personalizado con información relevante:

### Ejemplo - Alojamiento:
```
Hola! Me interesa reservar:

📌 ALOJAMIENTO
🏨 Hotel Ejemplo
📍 Buenos Aires, Argentina
⭐ 4 estrellas
💰 $15000 por noche

¿Podrían brindarme más información?
```

### Ejemplo - Vuelo:
```
Hola! Me interesa reservar:

📌 PASAJE
✈️ Buenos Aires → Bariloche
🛫 Aerolíneas Argentinas (AR1234)
📅 Salida: 15/02/2026
🎫 Clase: Económica
💰 $45000

¿Podrían brindarme más información?
```

## 🛠️ Personalización Avanzada

Si necesitas personalizar los mensajes, edita la función `generarMensaje` en el archivo `whatsapp.js`. Cada tipo de servicio tiene su propio caso en el switch.

## ✅ Verificación

Para probar que funciona correctamente:

1. Inicia la aplicación
2. Navega a cualquier sección de servicios
3. Haz clic en "Reservar" en cualquier tarjeta
4. Verifica que se abra WhatsApp con el mensaje correcto

## 🔒 Privacidad

- El número de WhatsApp solo se almacena en el archivo `whatsapp.js`
- No se envía información a servidores externos
- La API utilizada es la oficial de WhatsApp (wa.me)
- Funciona en cualquier dispositivo con WhatsApp instalado

## 📱 Compatibilidad

- ✅ WhatsApp Web
- ✅ WhatsApp Desktop
- ✅ WhatsApp Móvil (Android/iOS)
- ✅ Todos los navegadores modernos

## ❓ Preguntas Frecuentes

**P: ¿Necesito una cuenta de WhatsApp Business?**  
R: No, funciona con cualquier cuenta de WhatsApp.

**P: ¿Puedo usar múltiples números?**  
R: El sistema actual soporta un solo número. Para múltiples números, se requeriría modificar el código.

**P: ¿Los mensajes se envían automáticamente?**  
R: No, el mensaje se pre-carga pero el usuario debe hacer clic en "Enviar" en WhatsApp.

**P: ¿Funciona en localhost?**  
R: Sí, funciona tanto en desarrollo como en producción.

---

**Última actualización:** Enero 2026
