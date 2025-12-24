import { createContext, useEffect, useReducer } from 'react';
import AuthService from '../services/AuthService';

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return { ...state, isAuthenticated: action.payload.isAuthenticated, isInitialised: true, user: action.payload.user };
    }
    case 'LOGIN': {
      return { ...state, isAuthenticated: true, user: action.payload.user };
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
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    console.log("Auth Provider: Checking storage..."); // DEBUG LOG
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log("Auth Provider: Found user", storedUser); // DEBUG LOG
        dispatch({ type: 'INIT', payload: { isAuthenticated: true, user: JSON.parse(storedUser) } });
      } else {
        console.log("Auth Provider: No user found"); // DEBUG LOG
        dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
      }
    } catch (err) {
      console.error("Auth Provider Error:", err);
      dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
    }
  }, []);

  // If this text appears on your screen, the app is stuck here
  if (!state.isInitialised) return <div>Initializing Authentication...</div>;

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;