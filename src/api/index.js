

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
  const res = await fetch(`/api${path}`, {
    method: 'GET',
    credentials: 'include',
  });
  return handle(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body ?? {}),
  });
  return handle(res);
}

export async function apiDelete(path) {
  const res = await fetch(`/api${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handle(res);
}




export const getMe = () => apiGet('/auth/me');


export const getAllPosts        = () => apiGet('/posts');
export const getAllPostsCount   = () => apiGet('/posts/count');

// my post
export const getMyPosts         = () => apiGet('/posts/mine');
export const getMyPostsCount    = () => apiGet('/posts/mine/count');

// favorites
export const getFavorites       = () => apiGet('/favorites');
export const addFavorite        = (postId) => apiPost(`/favorites/${postId}`);
export const removeFavorite     = (postId) => apiDelete(`/favorites/${postId}`);
