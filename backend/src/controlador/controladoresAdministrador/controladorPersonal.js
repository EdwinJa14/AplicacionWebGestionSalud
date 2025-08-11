import * as PersonalModel from '../../modelo/modelosAdministrador/modeloPersonal.js';

// Función para validar formato DPI guatemalteco
const validarDPI = (dpi) => {
  // DPI guatemalteco: 13 dígitos
  const dpiRegex = /^\d{13}$/;
  return dpiRegex.test(dpi);
};

// Obtener todo el personal
export const getAllPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.getAll();

    // Eliminar 'estado' antes de enviar
    const personalFiltrado = personal.map(p => {
      const { estado, ...resto } = p;
      return resto;
    });

    res.status(200).json({ 
      success: true, 
      message: 'Personal obtenido exitosamente.', 
      data: personalFiltrado 
    });
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

// Obtener personal por ID
export const getPersonalById = async (req, res) => {
  try {
    const { id } = req.params;
    const personal = await PersonalModel.getById(id);
    
    if (!personal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Personal no encontrado.' 
      });
    }

    const { estado, ...resto } = personal;

    res.status(200).json({ 
      success: true, 
      message: 'Personal encontrado exitosamente.', 
      data: resto 
    });
  } catch (error) {
    console.error('Error al obtener personal por ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

// Crear nuevo personal
export const createPersonal = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      cargo,
      dpi,
      telefono
    } = req.body;
    
    // Validaciones obligatorias
    if (!nombres || !apellidos || !cargo || !dpi) {
      return res.status(400).json({ 
        success: false, 
        message: 'Los campos nombres, apellidos, cargo y DPI son obligatorios.' 
      });
    }

    // Validar formato DPI
    if (!validarDPI(dpi)) {
      return res.status(400).json({
        success: false,
        message: 'El DPI debe tener exactamente 13 dígitos.'
      });
    }

    // Verificar si el DPI ya existe
    const dpiExiste = await PersonalModel.existsByDpi(dpi);
    if (dpiExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe personal registrado con este DPI.'
      });
    }

    // Validar cargos válidos (opcional)
    const cargosValidos = ['Médico General', 'Enfermera Jefe', 'Administradora', 'Enfermero', 'Auxiliar', 'Otro'];
    if (cargo && !cargosValidos.includes(cargo)) {
      return res.status(400).json({
        success: false,
        message: 'Cargo no válido. Los cargos permitidos son: ' + cargosValidos.join(', ')
      });
    }

    const nuevoPersonal = await PersonalModel.create({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      cargo: cargo.trim(),
      dpi: dpi.trim(),
      telefono: telefono?.trim() || null
    });

    const { estado, ...resto } = nuevoPersonal;

    res.status(201).json({ 
      success: true, 
      message: 'Personal creado exitosamente.', 
      data: resto 
    });
  } catch (error) {
    console.error('Error al crear personal:', error);
    
    // Manejo específico de error de DPI duplicado
    if (error.code === '23505' && error.constraint === 'personal_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe personal registrado con este DPI.'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

// Actualizar personal
export const updatePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombres,
      apellidos,
      cargo,
      dpi,
      telefono
    } = req.body;

    // Validar formato DPI si se proporciona
    if (dpi && !validarDPI(dpi)) {
      return res.status(400).json({
        success: false,
        message: 'El DPI debe tener exactamente 13 dígitos.'
      });
    }

    // Verificar si el DPI ya existe (excluyendo el personal actual)
    if (dpi) {
      const dpiExiste = await PersonalModel.existsByDpi(dpi, id);
      if (dpiExiste) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro personal registrado con este DPI.'
        });
      }
    }

    // Validar cargos válidos si se proporciona
    if (cargo) {
      const cargosValidos = ['Médico General', 'Enfermera Jefe', 'Administradora', 'Enfermero', 'Auxiliar', 'Otro'];
      if (!cargosValidos.includes(cargo)) {
        return res.status(400).json({
          success: false,
          message: 'Cargo no válido. Los cargos permitidos son: ' + cargosValidos.join(', ')
        });
      }
    }

    const personalActualizado = await PersonalModel.update(id, {
      nombres: nombres?.trim(),
      apellidos: apellidos?.trim(),
      cargo: cargo?.trim(),
      dpi: dpi?.trim(),
      telefono: telefono?.trim()
    });

    if (!personalActualizado) {
      return res.status(404).json({ 
        success: false, 
        message: 'Personal no encontrado para actualizar.' 
      });
    }

    const { estado, ...resto } = personalActualizado;

    res.status(200).json({ 
      success: true, 
      message: 'Personal actualizado exitosamente.', 
      data: resto 
    });
  } catch (error) {
    console.error('Error al actualizar personal:', error);
    
    // Manejo específico de error de DPI duplicado
    if (error.code === '23505' && error.constraint === 'personal_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro personal registrado con este DPI.'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

// Eliminar personal (cambio de estado)
export const deletePersonal = async (req, res) => {
  try {
    const { id } = req.params;

    const personalEliminado = await PersonalModel.remove(id);

    if (!personalEliminado) {
      return res.status(404).json({ 
        success: false, 
        message: 'Personal no encontrado para eliminar.' 
      });
    }

    const { estado, ...resto } = personalEliminado;

    res.status(200).json({ 
      success: true, 
      message: 'Personal marcado como inactivo exitosamente.', 
      data: resto 
    });
  } catch (error) {
    console.error('Error al eliminar personal:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error interno del servidor.' 
    });
  }
};