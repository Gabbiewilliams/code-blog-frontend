import React from 'react';
import { googleLogout } from '@react-oauth/google';
import { apiPost } from '../api';
import { useAuth } from '../auth/AuthContext';

export default function Logout() {
  const { setUser } = useAuth();

  const logOut = async () => {
    try {
      await apiPost('/auth/logout'); // clears backend cookie
      googleLogout();                // optional: end Google client session
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={logOut} type="button" className="btn btn-light">
      Log out
    </button>
  );
}
