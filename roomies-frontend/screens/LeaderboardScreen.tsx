import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  useDerivedValue,
} from 'react-native-reanimated';
import GradientContainer from '../components/GradientContainer';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuthToken, apiFetch } from '../api/index';

const { width } = Dimensions.get('window');
const BAR_SPACING = 18;
const BAR_WIDTH = 48;
const AVATAR_SIZE = BAR_WIDTH;
const MAX_BAR_HEIGHT = 180;

function AnimatedBar({ user, index, anim, maxPoints }: any) {
  const barAnim = useDerivedValue(() =>
    withDelay(
      index * 120,
      withSpring(anim.value, { damping: 12, stiffness: 120 })
    )
  );

  const barStyle = useAnimatedStyle(() => ({
    height: barAnim.value * (user.rewardPoints / maxPoints) * MAX_BAR_HEIGHT,
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
    <Animated.View style={[styles.barColumn, { zIndex: 100 - index }]}>
      {index < 3 && (
        <Text style={styles.medal}>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
        </Text>
      )}
      <Animated.Text style={[styles.points, avatarStyle]}>
        {user.rewardPoints}
      </Animated.Text>
      <Animated.View style={[styles.bar, barStyle]} />
      <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
        <Image
          source={
            user.avatarUrl
              ? { uri: user.avatarUrl }
              : require('../assets/bear.png')
          }
          style={styles.avatar}
        />
      </Animated.View>
      <Animated.Text style={[styles.name, avatarStyle]} numberOfLines={1}>
        {user.username}
      </Animated.Text>
      <Animated.Text style={[styles.rank, avatarStyle]}>
        #{index + 1}
      </Animated.Text>
    </Animated.View>
  );
}

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const anim = useSharedValue(0);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      setLoading(true);
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error('Not authenticated');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const groupId = userDoc.data()?.groupId;
        if (!groupId) throw new Error('No group found');
        // Defensive: groupId may be a group code, not a Firestore doc ID
        // Try to find the group by groupCode if needed
        let groupDocId = groupId;
        if (groupId.length <= 8) { // likely a group code, not Firestore doc id
          // fetch all groups and find the one with this groupCode
          const token = await getAuthToken();
          const res = await apiFetch('/groups', token);
          const groups = await res.json();
          const found = groups.find((g: any) => g.groupCode === groupId);
          if (!found) throw new Error('Group not found');
          groupDocId = found.groupId;
        }
        const token = await getAuthToken();
        const res = await apiFetch(`/groups/${groupDocId}/members`, token);
        const groupUsers = await res.json();
        groupUsers.sort((a: any, b: any) => b.rewardPoints - a.rewardPoints);
        setUsers(groupUsers);
      } catch (err) {
        setUsers([]);
      }
      setLoading(false);
      anim.value = 1; // trigger animation after loading
    };
    fetchGroupUsers();
  }, []);

  if (loading) {
    return (
      <GradientContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4f8cff" />
        </View>
      </GradientContainer>
    );
  }

  if (!users.length) {
    return (
      <GradientContainer>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>No group members found.</Text>
      </GradientContainer>
    );
  }

  const maxPoints = users[0]?.rewardPoints || 1;
  const top3 = users.slice(0, 3);
  const restUsers = users.slice(3);

  return (
    <GradientContainer>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.chartRow}>
        {top3.map((user, idx) => (
          <AnimatedBar
            key={user.uid}
            user={user}
            index={idx}
            anim={anim}
            maxPoints={maxPoints}
          />
        ))}
      </View>
      {restUsers.length > 0 && (
        <FlatList
          data={restUsers}
          keyExtractor={item => item.uid}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text style={styles.rank}>#{index + 4}</Text>
              <Image
                source={
                  item.avatarUrl
                    ? { uri: item.avatarUrl }
                    : require('../assets/bear.png')
                }
                style={styles.avatarSmall}
              />
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.points}>{item.rewardPoints}</Text>
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