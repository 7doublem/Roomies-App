import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { apiFetch, getAuthToken } from './index';

// Get the current user's profile
export async function getUserProfile() {
  const token = await getAuthToken();
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

export const fetchUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  const docSnap = await getDoc(doc(db, 'users', user.uid));
  return docSnap.exists() ? docSnap.data() : null;
};

// (Optional) Create a new user (if your backend supports it)
export async function createUser(token: string, userData: any) {
  const res = await apiFetch('/users', token, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return res.json();
}