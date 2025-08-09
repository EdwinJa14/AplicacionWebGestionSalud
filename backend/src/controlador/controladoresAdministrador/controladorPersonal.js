import * as PersonalModel from '../../modelo/modelosAdministrador/modeloPersonal.js';

export const getAllPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.getAll();
    res.status(200).json({ 
      success: true, 
      message: 'Personal obtenido exitosamente.', 
      data: personal 
    });
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

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
    res.status(200).json({ 
      success: true, 
      message: 'Personal encontrado exitosamente.', 
      data: personal 
    });
  } catch (error) {
    console.error('Error al obtener personal por ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

export const createPersonal = async (req, res) => {
  try {
    const { nombres, apellidos, cargo, telefono, email, estado } = req.body;
    
    if (!nombres || !apellidos || !cargo || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Los campos nombres, apellidos, cargo y email son obligatorios.' 
      });
    }

    const nuevoPersonal = await PersonalModel.create({
      nombres,
      apellidos,
      cargo,
      telefono,
      email,
      estado: estado || 'activo'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Personal creado exitosamente.', 
      data: nuevoPersonal 
    });
  } catch (error) {
    console.error('Error al crear personal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

export const updatePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const personalActualizado = await PersonalModel.update(id, req.body);
    if (!personalActualizado) {
      return res.status(404).json({ 
        success: false, 
        message: 'Personal no encontrado para actualizar.' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Personal actualizado exitosamente.', 
      data: personalActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar personal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};

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
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar personal:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor.' 
    });
  }
};