import { apiFetch } from './index';

// Get all groups for the current user
export async function getGroups(token: string) {
  const res = await apiFetch('/groups', token);
  return res.json();
}

// Create a new group
export async function createGroup(token: string, name: string, members: string[]) {
  const res = await apiFetch('/groups', token, {
    method: 'POST',
    body: JSON.stringify({ name, members }),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

// Join a group by group code
export async function joinGroup(token: string, groupCode: string) {
  const res = await apiFetch('/groups/join', token, {
    method: 'PATCH',
    body: JSON.stringify({ groupCode: groupCode.trim() }),
  });

  return res;
}

// Get members of a group by groupId (Firestore doc id)
export async function getGroupMembers(token: string, groupId: string) {
  const res = await apiFetch(`/groups/${groupId}/members`, token);
  return res.json();
}