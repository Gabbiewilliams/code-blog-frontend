import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../api';
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function Favorites() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await getFavorites();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onUnfavorite(id) {
    try {
      await removeFavorite(id);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <p className="text-muted">Loading favorites…</p>;
  if (!posts.length) return <p className="text-muted">No favorites yet.</p>;

  return (
    <div className="d-grid gap-3">
      <h4>Your Favorites: {posts.length}</h4>

      {posts.map(p => (
        <article key={p._id} className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">{p.title}</h5>
                <div className="text-muted small">
                  by {p.author?.name ?? 'Unknown'} • {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onUnfavorite(p._id)}
                title="Remove from favorites"
              >
                ✕ Unfavorite
              </button>
            </div>

            {p.tags?.length ? (
              <div className="mt-2">
                {p.tags.map(t => (
                  <span key={t} className="badge text-bg-light me-1">#{t}</span>
                ))}
              </div>
            ) : null}

            <div className="mt-3" data-color-mode="light">
              <MarkdownPreview source="(Open a single post view to read content…)" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
