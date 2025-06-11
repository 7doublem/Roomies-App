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
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';

type Comment = {
  id: string;
  user: string;
  text: string;
  createdAt: number;
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
              headers: { Authorization: `Bearer ${token}` }
            });
            const groups = await res.json();
            const found = groups.find((g: any) => g.groupCode === groupId);
            if (found) groupDocId = found.groupId;
          }
        }
        const commentsRef = collection(db, 'groups', groupDocId, 'chores', choreId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetched: Comment[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            fetched.push({
              id: doc.id,
              user: data.createdByName || 'Unknown',
              text: data.commentBody,
              createdAt: data.createdAt,
            });
          });
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
    const user = getAuth().currentUser;
    if (!user) return;
    // Optionally fetch username from Firestore or use user.displayName
    const createdByName = user.displayName || user.email || 'User';
    const commentsRef = collection(db, 'groups', groupId, 'chores', choreId, 'comments');
    await addDoc(commentsRef, {
      commentBody: newComment,
      createdBy: user.uid,
      createdByName,
      createdAt: Date.now(),
    });
    setNewComment('');
  };

  const handleDeleteComment = async (id: string) => {
    // Optional: implement delete logic if needed
    // For now, only show delete for own comments, or skip delete
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
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentBox}>
              <View>
                <Text style={styles.CommentBoxUser}>{comment.user}</Text>
                <Text>{comment.text}</Text>
              </View>
              {/* Optionally add delete button if you want */}
            </View>
          ))}
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
