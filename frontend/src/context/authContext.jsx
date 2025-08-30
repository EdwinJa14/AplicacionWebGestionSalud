import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al login

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate(); // Redirección

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setRole(storedUser.rol); 
    }
    setIsLoading(false); 
  }, []); 

  const login = (userData) => {
    setUser(userData);
    setRole(userData.rol);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user'); 
    navigate('/'); // Redirigir al login
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
