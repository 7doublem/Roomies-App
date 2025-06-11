import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { styles } from './style';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { getAuthToken } from '../api/index';
import { createComment, deleteComment, getCommentsByChore } from '../api/comments';

type Comment = {
  id: string;
  user: string;
  text: string;
  createdAt: number;
  createdBy?: string;
};

type Props = {
  groupId: string;
  choreId: string;
};

export default function CommentSection({ groupId, choreId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Helper to fetch comments from backend and update state
  const fetchBackendComments = async () => {
    try {
      const token = await getAuthToken();
      const res = await getCommentsByChore(token, groupId, choreId);
      // Map backend response to Comment[]
      const fetched: Comment[] = (res || []).map((c: any) => ({
        id: c.commentId || c.id,
        user: c.createdByName || c.createdBy || 'Unknown',
        text: c.commentBody,
        createdAt: c.createdAt,
        createdBy: c.createdBy,
      }));
      setComments(fetched);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchComments = async () => {
      if (!groupId || !choreId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Defensive: groupId may be a group code, not a Firestore doc ID
        let groupDocId = groupId;
        if (groupId.length <= 8) {
          // Try to find the group by groupCode
          const user = getAuth().currentUser;
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const token = await user.getIdToken();
            const res = await fetch('https://roomiesapi-nrpu6hx2qq-nw.a.run.app/groups', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const groups = await res.json();
            const found = groups.find((g: any) => g.groupCode === groupId);
            if (found) groupDocId = found.groupId;
          }
        }
        const commentsRef = collection(db, 'groups', groupDocId, 'chores', choreId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));
        unsubscribe = onSnapshot(q, async (snapshot) => {
          const fetched: Comment[] = [];
          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            let userName = data.createdByName;
            // If username is missing, fetch from users collection
            if (!userName && data.createdBy) {
              try {
                const userDoc = await getDoc(doc(db, 'users', data.createdBy));
                userName = userDoc.exists()
                  ? userDoc.data()?.username || data.createdBy
                  : data.createdBy;
              } catch {
                userName = data.createdBy;
              }
            }
            fetched.push({
              id: docSnap.id,
              user: userName || 'Unknown',
              text: data.commentBody,
              createdAt: data.createdAt,
              createdBy: data.createdBy,
            });
          }
          setComments(fetched);
          setLoading(false);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        });
      } catch (err) {
        setComments([]);
        setLoading(false);
      }
    };
    fetchComments();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [groupId, choreId]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const token = await getAuthToken();
      await createComment(token, groupId, choreId, newComment.trim());
      setNewComment('');
      // Comments will refresh via Firestore listener if backend syncs to Firestore
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const token = await getAuthToken();
      await deleteComment(token, groupId, choreId, id);
      await fetchBackendComments();
    } catch (err) {
      // Optionally handle error
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color="#4f8cff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <View style={{ flex: 1 }}>
        <Text style={styles.commentTitle}>Comments</Text>
        <ScrollView
          style={styles.commentContainer}
          contentContainerStyle={{ paddingBottom: 100 }}
          ref={scrollViewRef}>
          {comments.map((comment) => {
            const currentUser = getAuth().currentUser;
            const canDelete = currentUser && (comment.createdBy === currentUser.uid);
            return (
              <View key={comment.id} style={styles.commentBox}>
                <View>
                  <Text style={styles.CommentBoxUser}>{comment.user}</Text>
                  <Text>{comment.text}</Text>
                </View>
                {canDelete && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(comment.id)}
                    style={{ marginLeft: 10 }}
                  >
                    <FontAwesome6 name="trash" size={16} color="#d11a2a" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.CommentInputWrapper}>
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            style={styles.CommentInput}
          />
          <TouchableOpacity style={styles.CommentSubmitButton} onPress={handleAddComment}>
            <Text style={styles.CommentSubmitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
