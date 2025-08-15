
const BASE =
  process.env.NODE_ENV === 'production'
    ? '' // same-origin (works with dispatch.yaml)
    : (process.env.REACT_APP_API_BASE || 'http://localhost:8081');


async function handle(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = text; }
  if (!res.ok) {
    throw new Error(typeof data === 'string' ? data : (data?.error || res.statusText));
  }
  return data;
}


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

// --- specific endpoints ---
export const health = () => apiGet('/health');

// auth
export const me = () => apiGet('/auth/me');
export const logout = () => apiPost('/auth/logout');
export const loginGoogle = (credential) => apiPost('/auth/google', { credential });

// posts
export const getPosts = () => apiGet('/posts');
export const getPostsCount = () => apiGet('/posts/count');
export const getMyPosts = () => apiGet('/posts/mine');
export const getPost = (id) => apiGet(`/posts/${id}`);
export const createPost = (data) => apiPost('/posts', data);

// favorites
export const getFavorites = () => apiGet('/favorites');
export const addFavorite = (postId) => apiPost(`/favorites/${postId}`);
export const removeFavorite = (postId) => apiDelete(`/favorites/${postId}`);

// Not implementing this functionality
export const listComments = (postId) => apiGet(`/posts/${postId}/comments`);
export const addComment = (postId, body) => apiPost(`/posts/${postId}/comments`, body);
export const deleteComment = (commentId) => apiDelete(`/comments/${commentId}`);


const api = {
  get: apiGet, post: apiPost, delete: apiDelete,
  health,
  me, logout, loginGoogle,
  getPosts, getPostsCount, getMyPosts, getPost, createPost,
  getFavorites, addFavorite, removeFavorite,
  listComments, addComment, deleteComment,
};
export default api;

