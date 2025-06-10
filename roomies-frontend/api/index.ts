import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase/config';

const API_URL = 'https://us-central1-roomies-app-32362.cloudfunctions.net/roomiesapi';

export async function apiFetch(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

 // Retrieves the current user's Firebase authentication token.
export async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await getIdToken(user);
}