const estilosPersonal = {
  box: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: { xs: 2, md: 4 },
  },
  header: {
    marginBottom: '3rem',
  },
  title: {
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: 40,
    color: '#3498db',
  },
  subtitle: {
    color: '#7f8c8d',
  },
  alert: {
    marginBottom: '3rem',
    borderRadius: '10px',
  },
  reintentarButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingY: 8,
  },
  loadingText: {
    marginLeft: 2,
    color: '#7f8c8d',
  },
  agregarPersonalContainer: {
    marginBottom: '2rem',
  },
  card: {
    borderRadius: 3,
    border: '1px solid #e1e8ed',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  cardHeaderContent: {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e1e8ed',
    paddingY: 2,
  },
  cardContent: {
    padding: 0,
  },
  emptyContainer: {
    textAlign: 'center',
    paddingY: 6,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#ccc',
    marginBottom: 2,
  },
  emptyText: {
    marginBottom: 2,
  },
  tableContainer: {
    maxHeight: '500px',
  },
  tableCellHeader: {
    fontWeight: 600,
    backgroundColor: '#f8f9fa',
    fontSize: '0.875rem',
    paddingY: 1.5,
  },
  tableRow: {
    '&:hover': { backgroundColor: '#f8f9fa' },
    '&:nth-of-type(even)': { backgroundColor: '#fafbfc' },
  },
  tableCell: {
    paddingY: 1,
  },
  actionsContainer: {
    display: 'flex',
    gap: 0.5,
  },
  editButton: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    '&:hover': { backgroundColor: '#ffeaa7' },
    minWidth: 32,
    height: 32,
  },
  deleteButton: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    '&:hover': { backgroundColor: '#f5c6cb' },
    minWidth: 32,
    height: 32,
  },
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

export default estilosPersonal;
