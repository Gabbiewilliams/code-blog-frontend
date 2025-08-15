import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { apiGet } from '../api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Restore session from httpOnly cookie (if logged in)
  useEffect(() => {
    apiGet('/auth/me').then(setUser).catch(() => {});
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Ctx.Provider value={{ user, setUser }}>
        {children}
      </Ctx.Provider>
    </GoogleOAuthProvider>
  );
}
