import * as PacienteModel from '../../modelo/modelosAdministrador/modeloPacientes.js';

// Función para validar formato DPI guatemalteco
const validarDPI = (dpi) => {
  // DPI guatemalteco: 13 dígitos
  const dpiRegex = /^\d{13}$/;
  return dpiRegex.test(dpi);
};

// Obtener todos los pacientes
export const getAllPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteModel.getAll();

    // Eliminar 'estado' antes de enviar
    const pacientesFiltrados = pacientes.map(p => {
      const { estado, ...resto } = p;
      return resto;
    });

    res.status(200).json({
      success: true,
      message: 'Pacientes obtenidos exitosamente.',
      data: pacientesFiltrados
    });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener un paciente por su ID
export const getPacienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await PacienteModel.getById(id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado.'
      });
    }

    const { estado, ...resto } = paciente;

    res.status(200).json({
      success: true,
      message: 'Paciente encontrado exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al obtener paciente por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      dpi,
      fecha_nacimiento,
      genero,
      direccion,
      telefono,
      tipo_paciente
    } = req.body;

    // Validaciones obligatorias
    if (!nombres || !apellidos || !dpi || !fecha_nacimiento) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombres, apellidos, DPI y fecha de nacimiento son obligatorios.'
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
    const dpiExiste = await PacienteModel.existsByDpi(dpi);
    if (dpiExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente registrado con este DPI.'
      });
    }

    // Validar género
    const generosValidos = ['Masculino', 'Femenino', 'Otro'];
    if (genero && !generosValidos.includes(genero)) {
      return res.status(400).json({
        success: false,
        message: 'El género debe ser: Masculino, Femenino o Otro.'
      });
    }

    // Validar fecha de nacimiento
    const fechaNac = new Date(fecha_nacimiento);
    const hoy = new Date();
    if (fechaNac > hoy) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de nacimiento no puede ser futura.'
      });
    }

    const nuevoPaciente = await PacienteModel.create({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      dpi: dpi.trim(),
      fecha_nacimiento,
      genero: genero || 'Masculino',
      direccion: direccion?.trim() || null,
      telefono: telefono?.trim() || null,
      tipo_paciente: tipo_paciente?.trim() || 'General'
    });

    const { estado, ...resto } = nuevoPaciente;

    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    
    // Manejo específico de error de DPI duplicado
    if (error.code === '23505' && error.constraint === 'pacientes_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente registrado con este DPI.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Actualizar un paciente existente
export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombres,
      apellidos,
      dpi,
      fecha_nacimiento,
      genero,
      direccion,
      telefono,
      tipo_paciente
    } = req.body;

    // Validar formato DPI si se proporciona
    if (dpi && !validarDPI(dpi)) {
      return res.status(400).json({
        success: false,
        message: 'El DPI debe tener exactamente 13 dígitos.'
      });
    }

    // Verificar si el DPI ya existe (excluyendo el paciente actual)
    if (dpi) {
      const dpiExiste = await PacienteModel.existsByDpi(dpi, id);
      if (dpiExiste) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro paciente registrado con este DPI.'
        });
      }
    }

    // Validar género
    if (genero) {
      const generosValidos = ['Masculino', 'Femenino', 'Otro'];
      if (!generosValidos.includes(genero)) {
        return res.status(400).json({
          success: false,
          message: 'El género debe ser: Masculino, Femenino o Otro.'
        });
      }
    }

    // Validar fecha de nacimiento
    if (fecha_nacimiento) {
      const fechaNac = new Date(fecha_nacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de nacimiento no puede ser futura.'
        });
      }
    }

    const pacienteActualizado = await PacienteModel.update(id, {
      nombres: nombres?.trim(),
      apellidos: apellidos?.trim(),
      dpi: dpi?.trim(),
      fecha_nacimiento,
      genero,
      direccion: direccion?.trim(),
      telefono: telefono?.trim(),
      tipo_paciente: tipo_paciente?.trim()
    });

    if (!pacienteActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado para actualizar.'
      });
    }

    const { estado, ...resto } = pacienteActualizado;

    res.status(200).json({
      success: true,
      message: 'Paciente actualizado exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    
    // Manejo específico de error de DPI duplicado
    if (error.code === '23505' && error.constraint === 'pacientes_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro paciente registrado con este DPI.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Eliminar un paciente (cambio de estado)
export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const pacienteEliminado = await PacienteModel.remove(id);

    if (!pacienteEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado para eliminar.'
      });
    }

    const { estado, ...resto } = pacienteEliminado;

    res.status(200).json({
      success: true,
      message: 'Paciente marcado como inactivo exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};