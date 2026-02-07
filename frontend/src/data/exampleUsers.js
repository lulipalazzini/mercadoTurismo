// Usuarios de ejemplo para testing

export const exampleUsers = {
  // Operador Independiente
  independiente: {
    operatorType: "independiente",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@gmail.com",
    phone: "+54 11 5234-8976",
    password: "Password123!",
    // Datos adicionales del perfil
    businessInfo: {
      cuit: "20-34567890-5",
      startDate: "2020-03-15",
      specialties: ["Tours de aventura", "Turismo rural", "Senderismo"],
      coverageArea: ["Mendoza", "San Juan", "La Rioja"],
    },
  },

  // Agencia de Viajes
  agencia: {
    operatorType: "agencia",
    agencyName: "Viajes del Sur S.A.",
    email: "contacto@viajesdelsur.com.ar",
    phone: "+54 11 4567-1234",
    password: "AgenciaPass2024!",
    // Datos adicionales del perfil
    businessInfo: {
      cuit: "30-12345678-9",
      legalName: "Viajes del Sur Sociedad Anónima",
      address: "Av. Corrientes 1234, CABA",
      startDate: "2015-08-20",
      evtNumber: "EVT-12345",
      employees: 25,
      branches: [
        {
          name: "Sucursal Centro",
          address: "Av. Corrientes 1234, CABA",
          phone: "+54 11 4567-1234",
        },
        {
          name: "Sucursal Palermo",
          address: "Av. Santa Fe 3456, CABA",
          phone: "+54 11 4567-5678",
        },
      ],
      specialties: [
        "Paquetes internacionales",
        "Cruceros",
        "Turismo corporativo",
        "Luna de miel",
      ],
    },
  },

  // Operador de Agencia
  operadorAgencia: {
    operatorType: "operador-agencia",
    firstName: "María",
    lastName: "González",
    agencyName: "Turismo Express SRL",
    email: "maria.gonzalez@turismoexpress.com",
    phone: "+54 11 6789-4321",
    password: "OperadorPass2024!",
    // Datos adicionales del perfil
    businessInfo: {
      agencyCuit: "30-98765432-1",
      agencyEvt: "EVT-54321",
      position: "Ejecutiva de Ventas Senior",
      department: "Ventas Corporativas",
      employeeId: "TE-2024-089",
      startDate: "2021-06-10",
      permissions: [
        "Reservar paquetes",
        "Emitir vouchers",
        "Acceso a tarifas especiales",
        "Gestión de clientes",
      ],
      agencyInfo: {
        name: "Turismo Express SRL",
        address: "Av. Callao 567, CABA",
        mainPhone: "+54 11 4321-9876",
      },
    },
  },
};

// Función para obtener usuario de ejemplo por tipo
export const getExampleUserByType = (type) => {
  const typeMap = {
    independiente: exampleUsers.independiente,
    agencia: exampleUsers.agencia,
    "operador-agencia": exampleUsers.operadorAgencia,
  };

  return typeMap[type] || null;
};

// Credenciales rápidas para testing
export const quickLoginCredentials = [
  {
    type: "Operador Independiente",
    email: "carlos.rodriguez@gmail.com",
    password: "Password123!",
  },
  {
    type: "Agencia de Viajes",
    email: "contacto@viajesdelsur.com.ar",
    password: "AgenciaPass2024!",
  },
  {
    type: "Operador de Agencia",
    email: "maria.gonzalez@turismoexpress.com",
    password: "OperadorPass2024!",
  },
];
