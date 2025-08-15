import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '../api';

export default function FavButton({ postId }) {
  const [mine, setMine] = useState(new Set());
  const [busy, setBusy] = useState(false);

  async function loadFavs() {
    try {
      const favs = await apiGet('/favorites'); // requires auth
      setMine(new Set(favs.map(f => (f._id || f)))); // supports both shapes
    } catch {
      setMine(new Set()); // not signed in: show empty
    }
  }

  useEffect(() => { loadFavs(); }, []);

  const isFav = mine.has(postId);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      if (isFav) {
        await apiDelete(`/favorites/${postId}`);
      } else {
        await apiPost(`/favorites/${postId}`);
      }
      await loadFavs();
    } catch (e) {
      alert(e.message || 'Failed to update favorites');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className={`btn btn-sm ${isFav ? 'btn-warning' : 'btn-outline-secondary'}`}
      onClick={toggle}
      disabled={busy}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFav ? '★ Favorited' : '☆ Favorite'}
    </button>
  );
}
