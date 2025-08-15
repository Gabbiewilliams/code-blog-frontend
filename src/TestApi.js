// src/TestApi.js
import { useEffect, useState } from 'react';
import { apiGet } from './api';

export default function TestApi() {
  const [status, setStatus] = useState('checking…');

  useEffect(() => {
    apiGet('/health')
      .then(() => setStatus('✅ API reachable'))
      .catch(err => setStatus('❌ ' + err.message));
  }, []);

  return <div className="alert alert-secondary mt-3">API status: {status}</div>;
}
