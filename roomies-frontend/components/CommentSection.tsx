import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './style';

type Comment = {
  id: number;
  user: string;
  text: string;
};

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setComments([
      { id: 1, user: 'Emma', text: 'Nice work' },
      { id: 2, user: 'John', text: 'Hello' },
    ]);
  }, []);

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const updatedComments = [
        ...comments,
        { id: comments.length + 1, user: 'You', text: newComment },
      ];
      setComments(updatedComments);
      setNewComment('');

      // Scroll to bottom after new comment
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

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
              <TouchableOpacity
                onPress={() => handleDeleteComment(comment.id)}
                style={styles.deleteIconContainer}>
                <FontAwesome6 name="circle-minus" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Fixed input at bottom */}
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
