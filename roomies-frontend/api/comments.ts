import { apiFetch } from './index';

// Get all comments for a specific chore in a group
export async function getCommentsByChore(token: string, groupId: string, choreId: string) {
  const res = await apiFetch(`/groups/${groupId}/chores/${choreId}/comments`, token);
  return res.json();
}

// Create a new comment for a specific chore in a group
export async function createComment(
  token: string,
  groupId: string,
  choreId: string,
  comment: string
) {
  const res = await apiFetch(`/groups/${groupId}/chores/${choreId}/comments`, token, {
    method: 'POST',
    body: JSON.stringify({ commentBody: comment }), // use commentBody key
  });
  return res.json();
}

// Delete a comment for a specific chore in a group
export async function deleteComment(
  token: string,
  groupId: string,
  choreId: string,
  commentId: string
) {
  const res = await apiFetch(
    `/groups/${groupId}/chores/${choreId}/comments/${commentId}`,
    token,
    { method: 'DELETE' }
  );
  return res.json();
}
