// src/pages/PostsList.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';           
import { apiGet } from '../api';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FavButton from '../components/FavButton';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const [list, { count }] = await Promise.all([
        apiGet('/posts'),
        apiGet('/posts/count'),
      ]);
      setPosts(list);
      setCount(count);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p className="text-muted">Loading posts…</p>;

  return (
    <div className="d-grid gap-3">
      <h3 className="mb-2">Total Posts: {count}</h3>

      {!posts.length ? (
        <p className="text-muted">No posts yet.</p>
      ) : posts.map(p => (
        <article key={p._id} className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                {/* ⬇️ link to the single-post page */}
                <h5 className="mb-1">
                  <Link to={`/posts/${p._id}`}>{p.title}</Link>
                </h5>
                <div className="text-muted small">
                  by {p.author?.name ?? 'Unknown'} • {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
              <FavButton postId={p._id} />
            </div>

            {p.tags?.length ? (
              <div className="mt-2">
                {p.tags.map(t => (
                  <span key={t} className="badge text-bg-light me-1">#{t}</span>
                ))}
              </div>
            ) : null}

            <div className="mt-3" data-color-mode="light">
              <MarkdownPreview source="(Click post to read)" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
