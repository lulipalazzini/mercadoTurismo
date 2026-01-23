const Paquete = require("../models/Paquete.model");
const User = require("../models/User.model");

const getPaquetes = async (req, res) => {
  console.log('\n🌄 [PAQUETES] Obteniendo todos los paquetes...');
  
  // Validar que res.json exista
  if (!res || typeof res.json !== 'function') {
    console.error('❌ [PAQUETES] Objeto res inválido');
    return;
  }
  
  try {
    const paquetes = await Paquete.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "razonSocial", "role"],
        },
      ],
    });
    console.log(`   Paquetes encontrados: ${paquetes.length}`);
    console.log('✅ [PAQUETES] Paquetes obtenidos exitosamente');
    
    // Asegurar que devolvemos JSON válido
    return res.status(200).json(paquetes);
  } catch (error) {
    console.error('❌ [PAQUETES] Error en getPaquetes:');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    
    return res.status(500).json({ 
      success: false,
      message: "Error al obtener paquetes", 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const getPaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    res.json(paquete);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener paquete", error: error.message });
  }
};

const createPaquete = async (req, res) => {
  try {
    console.log('\n➕ [PAQUETES] Creando nuevo paquete...');
    console.log('   Usuario ID:', req.user.id);
    console.log('   Datos:', JSON.stringify(req.body, null, 2));
    
    const paquete = await Paquete.create({
      ...req.body,
      cupoDisponible: req.body.cupoMaximo,
      createdBy: req.user.id, // Guardar quién creó el paquete
    });
    
    console.log(`✅ [PAQUETES] Paquete creado exitosamente - ID: ${paquete.id}`);
    res.status(201).json({ message: "Paquete creado exitosamente", paquete });
  } catch (error) {
    console.error('❌ [PAQUETES] Error en createPaquete:');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    res
      .status(500)
      .json({ message: "Error al crear paquete", error: error.message });
  }
};

const updatePaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    await paquete.update(req.body);
    res.json({ message: "Paquete actualizado exitosamente", paquete });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar paquete", error: error.message });
  }
};

const deletePaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    await paquete.destroy();
    res.json({ message: "Paquete eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar paquete", error: error.message });
  }
};


module.exports = {
  getPaquetes,
  getPaquete,
  createPaquete,
  updatePaquete,
  deletePaquete
};
