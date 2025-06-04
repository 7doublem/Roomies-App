import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientContainer({ children, style, ...props }: ViewProps) {
  return (
    <LinearGradient
      colors={['#96ceb4', '#ffeead', '#ffcc5c', '#ff6f69']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      <View style={styles.content} {...props}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});