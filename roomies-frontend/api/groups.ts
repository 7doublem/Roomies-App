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