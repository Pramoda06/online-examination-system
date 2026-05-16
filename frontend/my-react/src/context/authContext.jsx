import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('quizUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const persistUser = useCallback((nextUser) => {
    localStorage.setItem('quizUser', JSON.stringify(nextUser));
    localStorage.setItem('quizToken', nextUser.token);
    setUser(nextUser);
  }, []);

  const login = useCallback(async (payload) => {
    const nextUser = await loginRequest(payload);
    persistUser(nextUser);
    return nextUser;
  }, [persistUser]);

  const register = useCallback(async (payload) => {
    const nextUser = await registerRequest(payload);
    persistUser(nextUser);
    return nextUser;
  }, [persistUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('quizUser');
    localStorage.removeItem('quizToken');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout, isInstructor: user?.role === 'instructor' }),
    [login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
