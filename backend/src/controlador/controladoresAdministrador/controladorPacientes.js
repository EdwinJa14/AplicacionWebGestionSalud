import * as PacienteModel from '../../modelo/modelosAdministrador/modeloPacientes.js';

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
      fecha_nacimiento,
      genero,
      direccion,
      telefono,
      tipo_paciente,
      documento_identificacion
    } = req.body;

    if (!nombres || !apellidos || !fecha_nacimiento) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombres, apellidos y fecha de nacimiento son obligatorios.'
      });
    }

    const generosValidos = ['Masculino', 'Femenino', 'Otro'];
    if (genero && !generosValidos.includes(genero)) {
      return res.status(400).json({
        success: false,
        message: 'El género debe ser: Masculino, Femenino o Otro.'
      });
    }

    const tiposValidos = ['General', 'Cronico', 'Prenatal'];
    if (tipo_paciente && !tiposValidos.includes(tipo_paciente)) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de paciente debe ser: General, Cronico o Prenatal.'
      });
    }

    const nuevoPaciente = await PacienteModel.create({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      fecha_nacimiento,
      genero: genero || 'Masculino',
      direccion: direccion?.trim() || null,
      telefono: telefono?.trim() || null,
      tipo_paciente: tipo_paciente || 'General',
      documento_identificacion: documento_identificacion?.trim() || null
    });

    const { estado, ...resto } = nuevoPaciente;

    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al crear paciente:', error);
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
      fecha_nacimiento,
      genero,
      direccion,
      telefono,
      tipo_paciente,
      documento_identificacion
    } = req.body;

    if (genero) {
      const generosValidos = ['Masculino', 'Femenino', 'Otro'];
      if (!generosValidos.includes(genero)) {
        return res.status(400).json({
          success: false,
          message: 'El género debe ser: Masculino, Femenino o Otro.'
        });
      }
    }

    if (tipo_paciente) {
      const tiposValidos = ['General', 'Cronico', 'Prenatal'];
      if (!tiposValidos.includes(tipo_paciente)) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de paciente debe ser: General, Cronico o Prenatal.'
        });
      }
    }

    const pacienteActualizado = await PacienteModel.update(id, {
      nombres: nombres?.trim(),
      apellidos: apellidos?.trim(),
      fecha_nacimiento,
      genero,
      direccion: direccion?.trim(),
      telefono: telefono?.trim(),
      tipo_paciente,
      documento_identificacion: documento_identificacion?.trim()
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
