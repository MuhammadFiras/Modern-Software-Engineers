const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || JSON.stringify(err) || 'Request failed');
  }
  return res.json();
}

// Notes
export const getNotes = () => request('/notes/');
export const createNote = (data) => request('/notes/', { method: 'POST', body: JSON.stringify(data) });
export const updateNote = (id, data) => request(`/notes/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteNote = (id) => request(`/notes/${id}/`, { method: 'DELETE' });

// Action Items
export const getActionItems = () => request('/action-items/');
export const createActionItem = (data) => request('/action-items/', { method: 'POST', body: JSON.stringify(data) });
export const updateActionItem = (id, data) => request(`/action-items/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteActionItem = (id) => request(`/action-items/${id}/`, { method: 'DELETE' });
