import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiGet } from '../api';

export default function Profile() {
  const { user } = useAuth();        
  const [myCount, setMyCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        if (user?._id) {
          const mine = await apiGet('/posts/mine');
          setMyCount(mine.length);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [user?._id]);

  if (!user) return <p className="text-danger">Not signed in.</p>;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        {user.avatar ? (
          <img src={user.avatar} alt="avatar" width={64} height={64} style={{ borderRadius: '50%' }} />
        ) : (
          <div className="bg-primary text-white d-flex align-items-center justify-content-center"
               style={{ width: 64, height: 64, borderRadius: '50%' }}>
            {user.name?.[0] ?? 'U'}
          </div>
        )}
        <div>
          <h4 className="mb-1">{user.name}</h4>
          <div className="text-muted">{user.email}</div>
          <div className="mt-2">Posts you’ve made: <strong>{myCount}</strong></div>
        </div>
      </div>
    </div>
  );
}
