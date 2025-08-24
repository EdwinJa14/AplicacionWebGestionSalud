// estilosVistaAgregarUsuario.js
const estilosVistaAgregarUsuario = {
  card: {
    borderRadius: 3,
    border: '1px solid #e1e8ed',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    mb: 0,
  },
  cardHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e1e8ed',
    py: 2,
  },
  formTitle: {
    fontWeight: 600,
    color: '#1976d2',
    mb: 2,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: 1,
  },
  textField: {
    '& .MuiInputLabel-root': {
      fontSize: '1rem',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.875rem',
    },
  },
  inputProps: {
    height: 56,
    fontSize: '1rem',
  },
  button: {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    px: 6,
    py: 1.5,
    fontSize: '1rem',
    minHeight: 48,
    minWidth: 140,
    '&:hover': {
      borderColor: '#145a86',
      backgroundColor: 'rgba(21, 101, 192, 0.08)',
    },
  },
  buttonSubmit: {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    px: 6,
    py: 1.5,
    fontSize: '1rem',
    minHeight: 48,
    minWidth: 180,
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
  },
};

export default estilosVistaAgregarUsuario;