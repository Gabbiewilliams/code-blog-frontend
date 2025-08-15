import { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { apiGet, apiPost } from '../api';

const parseTags = (s) =>
  (s || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

export default function Home() {
  const titleRef = useRef(null);
  const tagsRef  = useRef(null);

  const [body, setBody] = useState('## Welcome!\nWrite your post here…');
  const [publishing, setPublishing] = useState(false);
  const [mine, setMine] = useState([]);

  async function loadMine() {
    try {
      const posts = await apiGet('/posts/mine');
      setMine(posts);
    } catch (e) {
      // not signed in 
      setMine([]);
    }
  }

  useEffect(() => {
    loadMine();
  }, []);

  async function handlePublish(e) {
    e.preventDefault();
    const title = titleRef.current?.value || '';
    const tags  = parseTags(tagsRef.current?.value || '');

    if (!title.trim() || !body?.trim()) {
      alert('Please enter both a title and body.');
      return;
    }

    try {
      setPublishing(true);
      await apiPost('/posts', { title: title.trim(), body, tags });
      // tags
      titleRef.current.value = '';
      setBody('');
      await loadMine();
    } catch (err) {
      alert(err?.message || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="pb-5">
      <h2 className="mb-4">Create a new post</h2>

      <form onSubmit={handlePublish}>
        <input
          ref={titleRef}
          className="form-control mb-3"
          placeholder="Title"
        />

        <input
          ref={tagsRef}
          className="form-control mb-3"
          placeholder="tags (comma-separated)"
        />

        <div data-color-mode="light" className="mb-3">
          <MDEditor height={380} value={body} onChange={setBody} />
        </div>

        <button className="btn btn-primary" disabled={publishing}>
          {publishing ? 'Publishing…' : 'Publish'}
        </button>
      </form>

      <hr className="my-4" />

      <div className="d-flex align-items-center justify-content-between">
        <h4>Your posts</h4>
        <a href="/posts" className="btn btn-outline-secondary btn-sm">
          Browse all posts
        </a>
      </div>

      {mine.length === 0 ? (
        <p className="text-muted mt-3">No posts yet.</p>
      ) : (
        <ul className="mt-3">
          {mine.map(p => (
            <li key={p._id}>
              <strong>{p.title}</strong> <span className="text-muted">({p.tags?.join(', ')})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
