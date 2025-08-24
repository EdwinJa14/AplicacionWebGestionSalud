// Ubicación: /estilosVistas/estilosInventario/estilosAgregarInventario.js

const estilosVistaAgregarInventario = {
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
        color: '#27ae60', // Color verde del tema de inventario
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
        color: '#27ae60',
        borderColor: '#27ae60',
        '&:hover': {
            borderColor: '#1e8449',
            backgroundColor: 'rgba(39, 174, 96, 0.08)',
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
        backgroundColor: '#27ae60',
        boxShadow: '0 4px 12px rgba(39, 174, 96, 0.4)',
        '&:hover': {
            backgroundColor: '#1e8449',
        },
        '&:disabled': {
            backgroundColor: '#95a5a6',
        },
    },
};

export default estilosVistaAgregarInventario;
