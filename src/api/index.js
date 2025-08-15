// src/api/index.js

// Base URL: prod uses App Engine; dev uses your local backend.
// You can override either with REACT_APP_API_BASE.
const BASE =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_API_BASE || 'https://code-blog-12345.uw.r.appspot.com')
    : (process.env.REACT_APP_API_BASE || 'http://localhost:8081');

// --- small helper to normalize responses ---
async function handle(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
  if (!res.ok) {
    throw new Error(typeof data === 'string' ? data : (data?.error || res.statusText));
  }
  return data;
}

// --- generic helpers (keep existing usage working) ---
export async function apiGet(path) {
  const res = await fetch(`${BASE}/api${path}`, {
    method: 'GET',
    credentials: 'include',
  });
  return handle(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body ?? {}),
  });
  return handle(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE}/api${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handle(res);
}

// --- specific endpoints your UI may import ---

// health
export const health = () => apiGet('/health');

// auth
export const me = () => apiGet('/auth/me');
export const logout = () => apiPost('/auth/logout');
export const loginGoogle = (credential) => apiPost('/auth/google', { credential });

// posts
export const getPosts = () => apiGet('/posts');
export const getPostsCount = () => apiGet('/posts/count');       // { count }
export const getMyPosts = () => apiGet('/posts/mine');
export const getPost = (id) => apiGet(`/posts/${id}`);
export const createPost = (data) => apiPost('/posts', data);
// if you later add edit/delete posts, you can implement these:
// export const updatePost = (id, data) => apiPost(`/posts/${id}`, data);
// export const deletePost = (id) => apiDelete(`/posts/${id}`);

// favorites
export const getFavorites = () => apiGet('/favorites');
export const addFavorite = (postId) => apiPost(`/favorites/${postId}`);
export const removeFavorite = (postId) => apiDelete(`/favorites/${postId}`);

// comments
export const listComments = (postId) => apiGet(`/posts/${postId}/comments`);
export const addComment = (postId, body) => apiPost(`/posts/${postId}/comments`, body);
export const deleteComment = (commentId) => apiDelete(`/comments/${commentId}`);

// Optional: default export for code that does `import api from '../api'`
const api = {
  // base helpers
  get: apiGet, post: apiPost, delete: apiDelete,
  // health
  health,
  // auth
  me, logout, loginGoogle,
  // posts
  getPosts, getPostsCount, getMyPosts, getPost, createPost,
  // favorites
  getFavorites, addFavorite, removeFavorite,
  // comments
  listComments, addComment, deleteComment,
};
export default api;
