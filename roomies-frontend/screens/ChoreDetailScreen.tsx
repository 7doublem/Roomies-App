import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from 'components/style';
import GradientContainer from '../components/GradientContainer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CommentSection from '../components/CommentSection';
import { useEffect, useState } from 'react';
import { getAuthToken, apiFetch } from '../api/index';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function ChoreDetailScreen({ navigation, route }: any) {
  const { groupId, choreId } = route.params;
  const [chore, setChore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignedUserName, setAssignedUserName] = useState<string>('');

  useEffect(() => {
    const fetchChore = async () => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        // Fetch all chores for the group
        const res = await apiFetch(`/groups/${groupId}/chores`, token);
        const chores = await res.json();
        const choresArr = Array.isArray(chores) ? chores : [];
        // Find the chore by id
        const found = choresArr.find((c: any) => String(c.id) === String(choreId));
        setChore(found || null);

        // Fetch assigned user's username if assignedTo exists
        if (found && found.assignedTo) {
          const userDoc = await getDoc(doc(db, 'users', found.assignedTo));
          setAssignedUserName(userDoc.exists() ? userDoc.data()?.username || found.assignedTo : found.assignedTo);
        } else {
          setAssignedUserName('');
        }
      } catch (err) {
        setChore(null);
        setAssignedUserName('');
      }
      setLoading(false);
    };
    fetchChore();
  }, [groupId, choreId]);

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskDetail_Screen_text}>Chore Details</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('UpdateChoreScreen', { groupId, choreId })}>
          <MaterialIcons name="mode-edit" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : chore ? (
            <>
              {/* Reward badge */}
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>{chore.rewardPoints}</Text>
              </View>
              {/* Chore info */}
              <Text style={styles.choreName}>{chore.name}</Text>
              <Text style={styles.assignedTo}>
                👤 Assigned to: {assignedUserName || chore.assignedTo}
              </Text>
              {/* Chore description */}
              <Text style={{ fontSize: 15, color: '#555', marginBottom: 6 }}>
                {chore.description ? `📝 ${chore.description}` : ''}
              </Text>
              {/* Optionally add countdown logic here if needed */}
              <Text style={styles.countdown}></Text>
              <Text style={styles.startdate}>
                ⏳ Start Date:{' '}
                {chore.startDate ? new Date(chore.startDate * 1000).toLocaleDateString() : ''}
              </Text>
            </>
          ) : (
            <Text>Chore not found.</Text>
          )}
        </View>
        {/* Import Comment Section */}
        <CommentSection groupId={groupId} choreId={choreId} />
      </View>
    </GradientContainer>
  );
}
