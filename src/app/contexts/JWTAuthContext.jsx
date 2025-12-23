import { createContext, useEffect, useReducer } from 'react';
import AuthService from '../services/AuthService';

// Initial State
const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }
    case 'LOGIN': {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }
    case 'LOGOUT': {
      return { ...state, isAuthenticated: false, user: null };
    }
    default: return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    const user = await AuthService.login(email, password);
    // Save to LocalStorage to persist login on refresh
    localStorage.setItem('user', JSON.stringify(user)); 

    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    // Check LocalStorage on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch({ type: 'INIT', payload: { isAuthenticated: true, user: JSON.parse(storedUser) } });
    } else {
      dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
    }
  }, []);

  if (!state.isInitialised) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;