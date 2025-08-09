import fondoLogin from '../../assets/fondoLogin.jpg';

 export const styles = {
   panel: {
     width: '100%',
     minHeight: '100vh',

     background:
       `linear-gradient(rgba(235, 245, 251, 0.85), rgba(235, 245, 251, 0.85)),
        url(${fondoLogin})`,

     backgroundRepeat: 'repeat',
     backgroundSize: 'auto',

     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     padding: '20px',
     boxSizing: 'border-box',
   },
 };