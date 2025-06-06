import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  useDerivedValue,
  FadeInUp,
  runOnJS,
} from 'react-native-reanimated';
import GradientContainer from '../components/GradientContainer';

const users = [
  { id: '1', name: 'Alice', points: 120, avatar: require('../assets/bear.png') },
  { id: '2', name: 'Bob', points: 110, avatar: require('../assets/deer.png') },
  { id: '3', name: 'Charlie', points: 100, avatar: require('../assets/turtle.png') },
  { id: '4', name: 'David', points: 90, avatar: require('../assets/bear.png') },
  { id: '5', name: 'Eve', points: 80, avatar: require('../assets/deer.png') },
  { id: '6', name: 'Suhaim', points: 70, avatar: require('../assets/deer.png') },
  { id: '7', name: 'Wendy', points: 150, avatar: require('../assets/deer.png') }
];

const { width } = Dimensions.get('window');
const BAR_SPACING = 18;
const BAR_WIDTH = Math.max(36, Math.min(56, width / (users.length * 2)));
const AVATAR_SIZE = BAR_WIDTH;
const MAX_BAR_HEIGHT = 180;

// Sort users by points descending
const sortedUsers = [...users].sort((a, b) => b.points - a.points);
const maxPoints = sortedUsers[0]?.points || 1;

function AnimatedBar({ user, index, anim, onFinish }: any) {
  // Animate bar height
  const barAnim = useDerivedValue(() =>
    withDelay(
      index * 120,
      withSpring(anim.value, { damping: 12, stiffness: 120 }, (finished) => {
        if (finished && onFinish) runOnJS(onFinish)();
      })
    )
  );

  const barStyle = useAnimatedStyle(() => ({
    height: barAnim.value * (user.points / maxPoints) * MAX_BAR_HEIGHT,
    opacity: barAnim.value,
    backgroundColor: index === 0 ? '#ffcc5c' : index === 1 ? '#ffeead' : index === 2 ? '#96ceb4' : '#fff',
    borderRadius: 16,
    shadowColor: index === 0 ? '#ffcc5c' : '#000',
    shadowOpacity: index === 0 ? 0.6 : 0.1,
    shadowRadius: index === 0 ? 8 : 2,
    shadowOffset: { width: 0, height: 2 },
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    opacity: barAnim.value,
    transform: [{ scale: barAnim.value }],
  }));

  return (
    <Animated.View style={[styles.barColumn, { zIndex: users.length - index }]}>
      {index < 3 && (
        <Text style={styles.medal}>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
        </Text>
      )}
      <Animated.Text style={[styles.points, avatarStyle]}>
        {user.points}
      </Animated.Text>
      <Animated.View style={[styles.bar, barStyle]} />
      <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
        <Image source={user.avatar} style={styles.avatar} />
      </Animated.View>
      <Animated.Text style={[styles.name, avatarStyle]} numberOfLines={1}>
        {user.name}
      </Animated.Text>
      <Animated.Text style={[styles.rank, avatarStyle]}>
        #{index + 1}
      </Animated.Text>
    </Animated.View>
  );
}

export default function LeaderboardScreen() {
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = 1;
  }, []);

  // Add logic to get users after the top 5
  const restUsers = sortedUsers.slice(5);

  return (
    <GradientContainer>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.chartRow}>
        {sortedUsers.slice(0, 5).map((user, idx) => (
          <AnimatedBar
            key={user.id}
            user={user}
            index={idx}
            anim={anim}
            onFinish={idx === sortedUsers.length - 1 ? () => {} : undefined}
          />
        ))}
      </View>
      {/* Render restUsers in a FlatList if there are more than 5 */}
      {restUsers.length > 0 && (
        <FlatList
          data={restUsers}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text style={styles.rank}>#{index + 6}</Text>
              <Image source={item.avatar} style={styles.avatarSmall} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.points}>{item.points}</Text>
            </View>
          )}
          style={{ marginTop: 24 }}
        />
      )}
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginVertical: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 32,
    gap: BAR_SPACING,
    minHeight: MAX_BAR_HEIGHT + 80,
  },
  barColumn: {
    alignItems: 'center',
    width: BAR_WIDTH,
    marginHorizontal: 4,
  },
  bar: {
    width: BAR_WIDTH,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  avatar: {
    width: AVATAR_SIZE - 4,
    height: AVATAR_SIZE - 4,
    borderRadius: (AVATAR_SIZE - 4) / 2,
  },
  name: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
    width: BAR_WIDTH + 10,
    textAlign: 'center',
  },
  points: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  listItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.7)',
  marginVertical: 4,
  marginHorizontal: 24,
  borderRadius: 8,
  padding: 12,
  justifyContent: 'space-between',
},
avatarSmall: {
  width: 28,
  height: 28,
  borderRadius: 14,
  marginRight: 8,
},
medal: {
  fontSize: 24,
  marginBottom: 2,
  textAlign: 'center',
},
rank: {
  color: '#111',
  fontWeight: 'bold',
  fontSize: 12,
  marginTop: 2,
  textAlign: 'center',
}
});