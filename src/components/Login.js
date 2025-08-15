import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { apiPost } from '../api';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { setUser } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        try {
          const user = await apiPost('/auth/google', { credential: res.credential });
          setUser(user); // {_id, name, email, avatar}
        } catch (err) {
          alert('Login failed: ' + err.message);
        }
      }}
      onError={() => alert('Google login failed')}
    />
  );
}
