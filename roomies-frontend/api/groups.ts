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
  const res = await apiFetch('/groups/join', token, {
    method: 'PATCH',
    body: JSON.stringify({ groupCode: groupCode.trim() }),
  });
  return res;
}