import { fontFamilyHeadings, fontFamilyBody } from './nomenclaturaGeneral';

export const styles = {
  loginCard: {
    fontFamily: fontFamilyBody, 
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    minHeight: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  formPanel: {
    flex: 1,
    backgroundColor: '#33538B',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  welcomePanel: {
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  formTitle: {
    fontFamily: fontFamilyHeadings, // Fuente para títulos
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  formSubtitle: {
    fontFamily: fontFamilyBody, // Fuente para texto normal
    color: '#EBF5FB',
    fontSize: '16px',
    marginBottom: '30px',
  },
  tituloApp: {
    fontFamily: fontFamilyHeadings, // Fuente para títulos
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#34495E',
    margin: '0 0 5px',
  },
  subtituloApp: {
    fontFamily: fontFamilyBody, // Fuente para texto normal
    fontSize: '18px',
    color: '#33538B',
    margin: 0,
  },
  logo: {
    width: '250px',
    marginTop: '30px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '20px',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '15px',
    transform: 'translateY(-50%)',
  },
  input: {
    fontFamily: fontFamilyBody, // Fuente para el texto dentro del input
    width: '100%',
    padding: '12px 12px 12px 50px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: '#333',
    boxSizing: 'border-box',
  },
  eyeButton: {
    position: 'absolute',
    top: '50%',
    right: '15px',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  submitButton: {
    fontFamily: fontFamilyBody, // Fuente para el botón
    width: '100%',
    padding: '12px',
    backgroundColor: '#EBF5FB',
    color: '#33538B',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  secondaryButton: {
    fontFamily: fontFamilyBody, // Fuente para el botón
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};