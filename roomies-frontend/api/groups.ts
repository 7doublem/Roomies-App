import { apiFetch } from './index';

// Get all groups for the current user
export async function getGroups(token: string) {
  const res = await apiFetch('/groups', token);
  return res.json();
}

// Create a new group
export async function createGroup(token: string, name: string, usernames: string[]) {
  const res = await apiFetch('/groups', token, {
    method: 'POST',
    body: JSON.stringify({ name, usernames }),
  });
  return res.json();
}

// Join a group by group code
export async function joinGroup(token: string, groupCode: string) {
  const API_URL = 'https://roomiesapi-34btz44gbq-uc.a.run.app';
  const res = await fetch(`${API_URL}/groups/join`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ groupCode: groupCode.trim() }),
  });
  return res;
}