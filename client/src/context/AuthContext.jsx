import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Auth = createContext();
export const useAuth = () => useContext(Auth);

const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (!token && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/') {
            navigate('/login');
        }
    }, [token]);

    return (
        <Auth.Provider value={{ token, setToken }}>{children}</Auth.Provider>
    )
}

export default AuthContextProvider;