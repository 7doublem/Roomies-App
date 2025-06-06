import { apiFetch } from './index';

// Get the current user's profile
export async function getUserProfile(token: string) {
  const res = await apiFetch('/users/me', token);
  return res.json();
}

// Update the current user's profile
export async function updateUserProfile(token: string, profileData: any) {
  const res = await apiFetch('/users/me', token, {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
  return res.json();
}

// (Optional) Create a new user (if your backend supports it)
export async function createUser(token: string, userData: any) {
  const res = await apiFetch('/users', token, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return res.json();
}