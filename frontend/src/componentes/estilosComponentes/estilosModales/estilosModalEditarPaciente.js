// estilosModalEditarPaciente.js

export const inputSx = {
  mb: 3,
  '& .MuiInputBase-root': {
    minHeight: 65,
  },
  '& input': {
    fontSize: '1rem',
    padding: '12px 12px',
  },
  '& .MuiSelect-select': {
    fontSize: '1rem',
    padding: '12px 14px',
  },
};

export const iconWrapperSx = {
  width: 36,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const dialogPaperSx = {
  borderRadius: 3,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#fff',
  margin: 2,
  border: '1px solid #e1e8ed',
};

export const dialogTitleSx = {
  p: 2,
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #e1e8ed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
};

export const dialogHeaderLeftBoxSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

export const dialogHeaderTitleSx = {
  fontWeight: 700,
  color: '#2c3e50',
};

export const sectionTitleSx = {
  fontWeight: 600,
  color: '#3498db',
  mb: 2,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: 1,
};

export const dualFieldGeneroGridSx = {
  pr: 6,
};

export const dualFieldTipoPacienteGridSx = {
  pl: 1,
};

export const dialogActionsSx = {
  p: 3,
  backgroundColor: '#f8f9fa',
  borderTop: '1px solid #e1e8ed',
  justifyContent: 'center',
  gap: 3,
};

export const cancelButtonSx = {
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 600,
  px: 4,
  py: 1.5,
  minWidth: 120,
};

export const saveButtonSx = {
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 600,
  px: 5,
  py: 1.5,
  minWidth: 140,
  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(52, 152, 219, 0.4)',
  },
};
