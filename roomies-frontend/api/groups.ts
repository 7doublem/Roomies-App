import { apiFetch } from './index';

export async function getGroups(token: string) {
  const res = await apiFetch('/groups', token);
  return res.json();
}

export async function createGroup(token: string, name: string, usernames: string[]) {
  const res = await apiFetch('/groups', token, {
    method: 'POST',
    body: JSON.stringify({ name, usernames }),
  });
  return res.json();
}

export async function joinGroup(token: string, groupId: string) {
  const API_URL = 'https://roomiesapi-6l3ldzfk4q-uc.a.run.app';
  const res = await fetch(`${API_URL}/groups/join`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ groupId: groupId.trim() }),
  });
  return res;
}