// src/pages/PostPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../api';
import MarkdownPreview from '@uiw/react-markdown-preview';
import FavButton from '../components/FavButton';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await apiGet(`/posts/${id}`);
        setPost(data);
      } catch (e) {
        console.error(e);
        setErr(e.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="text-muted">Loading post…</p>;
  if (err) return <p className="text-danger">{err}</p>;
  if (!post) return <p className="text-muted">Post not found.</p>;

  return (
    <article className="card p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h3 className="mb-1">{post.title}</h3>
          <div className="text-muted small">
            by {post.author?.name ?? 'Unknown'} • {new Date(post.createdAt).toLocaleString()}
          </div>
          {post.tags?.length ? (
            <div className="mt-2">
              {post.tags.map(t => (
                <span key={t} className="badge text-bg-light me-1">#{t}</span>
              ))}
            </div>
          ) : null}
        </div>
        <FavButton postId={post._id} />
      </div>

      <div className="mt-4" data-color-mode="light">
        {/* Use `body` from the API (not `content`) */}
        <MarkdownPreview source={post.body || '(No content provided)'} />
      </div>
    </article>
  );
}
