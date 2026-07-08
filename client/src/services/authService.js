import api from './api';

const AUTH_STORAGE_KEY = 'team-task-manager-auth';

export function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeAuth(payload) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);
  const payload = { token: response.data.token, user: response.data.user };
  storeAuth(payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload);
  const data = response.data;

  if (data?.token && data?.user) {
    storeAuth({ token: data.token, user: data.user });
  }

  return data;
}
