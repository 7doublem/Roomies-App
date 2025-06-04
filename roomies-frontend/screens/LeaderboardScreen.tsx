import { View, Text, FlatList, StyleSheet } from 'react-native';
import GradientContainer from '../components/GradientContainer';

const users = [
  { id: '1', name: 'Alice', points: 120 },
  { id: '2', name: 'Bob', points: 110 },
  { id: '3', name: 'Charlie', points: 100 },
  { id: '4', name: 'David', points: 90 },
  { id: '5', name: 'Eve', points: 80 },
];

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const podium = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  return (
    <GradientContainer>
      <Text style={styles.title}>Leaderboard</Text>
      {/* Podium */}
      <View style={styles.podiumContainer}>
        {podium.map((user, idx) => (
          <View key={user.id} style={[styles.podiumSpot, styles[`podium${idx}`]]}>
            <Text style={styles.medal}>{medals[idx]}</Text>
            <Text style={styles.podiumName}>{user.name}</Text>
            <Text style={styles.podiumPoints}>{user.points} pts</Text>
          </View>
        ))}
      </View>
      {/* Leaderboard List */}
      <FlatList
        data={rest}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.rank}>{index + 4}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
        style={{ marginTop: 24 }}
      />
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
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
    gap: 12,
  },
  podiumSpot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
    borderRadius: 16,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  podium0: { height: 140, backgroundColor: '#ffcc5c' }, // Gold
  podium1: { height: 110, backgroundColor: '#ffeead' }, // Silver
  podium2: { height: 90, backgroundColor: '#96ceb4' },  // Bronze
  medal: { fontSize: 32, marginBottom: 4 },
  podiumName: { color: '#111', fontWeight: 'bold', fontSize: 16 },
  podiumPoints: { color: '#111', fontSize: 14 },
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
  rank: { color: '#111', fontWeight: 'bold', width: 24, textAlign: 'center' },
  name: { color: '#111', flex: 1, marginLeft: 8 },
  points: { color: '#111', fontWeight: 'bold' },
});