// estilosPacientes.js

export const estilosVistaPacientes = {
  // Estilos para el contenedor principal
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    p: { xs: 2, md: 4 },
  },

  // Estilos para el header
  header: {
    mb: 3,
  },

  titulo: {
    fontWeight: 700,
    color: '#2c3e50',
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  iconoTitulo: {
    fontSize: 40,
    color: '#3498db',
  },

  subtitulo: {
    variant: 'subtitle1',
    color: 'text.secondary',
  },

  // Estilos para las alertas de error
  alert: {
    mb: 3,
    borderRadius: 2,
  },

  // Estilos para el circular progress
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 8,
  },

  loadingText: {
    ml: 2,
    color: 'text.secondary',
  },

  // Estilos para el Card
  card: {
    borderRadius: 3,
    border: '1px solid #e1e8ed',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },

  cardHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e1e8ed',
    py: 2,
  },

  chipHeader: {
    color: 'primary',
    variant: 'outlined',
    size: 'small',
  },

  // Estilos para las celdas de la tabla
  tableCell: {
    fontWeight: 600,
    backgroundColor: '#f8f9fa',
    fontSize: '0.875rem',
    py: 1.5,
  },

  tableRowHover: {
    '&:hover': { backgroundColor: '#f8f9fa' },
    '&:nth-of-type(even)': { backgroundColor: '#fafbfc' },
  },

  tableBodyTypography: {
    py: 1,
  },

  chipCell: {
    size: 'small',
    variant: 'outlined',
  },

  // Estilos para los iconos de acción
  iconButton: {
    minWidth: 32,
    height: 32,
  },

  iconButtonEditar: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    '&:hover': { backgroundColor: '#ffeaa7' },
  },

  iconButtonEliminar: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    '&:hover': { backgroundColor: '#f5c6cb' },
  },

  // Estilos para Snackbar
  snackbar: {
    zIndex: 9999,
  },

  alertSnackbar: {
    width: '100%',
    fontSize: '0.95rem',
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
};
