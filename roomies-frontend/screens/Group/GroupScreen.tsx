import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from 'components/style';
import GradientContainer from 'components/GradientContainer';
import Animated, { FadeInUp, withSpring } from 'react-native-reanimated';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuthToken, apiFetch } from '../../api/index';

export default function GroupScreen({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [groupCode, setGroupCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        let groupId = userData?.groupId;
        if (!groupId) return;

        // Defensive: groupId may be a group code, not a Firestore doc ID
        let groupDocId = groupId;
        if (groupId.length <= 8) {
          const token = await getAuthToken();
          const res = await apiFetch('/groups', token);
          const groups = await res.json();
          const found = groups.find((g: any) => g.groupCode === groupId);
          if (!found) {
            setUsers([]);
            setGroupCode(null);
            return;
          }
          groupDocId = found.groupId;
          setGroupCode(found.groupCode);
        } else {
          const groupDoc = await getDoc(doc(db, 'groups', groupDocId));
          const groupData = groupDoc.data();
          if (groupData?.groupCode) setGroupCode(groupData.groupCode);
        }

        // --- Use the same logic as LeaderboardScreen ---
        const token = await getAuthToken();
        const res = await apiFetch(`/groups/${groupDocId}/members`, token);
        const groupUsers = await res.json();
        const members = Array.isArray(groupUsers)
          ? groupUsers.map((user: any) => ({
              id: user.uid,
              name: user.username || 'Unknown',
              totalPoints: user.rewardPoints || 0,
              avatar: user.avatarUrl ? { uri: user.avatarUrl } : require('assets/bear.png'),
            }))
          : [];
        setUsers(members);
      } catch (err) {
        setUsers([]);
        setGroupCode(null);
      }
    };
    fetchGroupMembers();
  }, []);

  const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Your Group</Text>
        {groupCode && (
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: '#555' }}>
              Group Code: <Text style={{ fontWeight: 'bold', color: '#222' }}>{groupCode}</Text>
            </Text>
          </View>
        )}
        <View style={styles.groupScreen_container}>
          <Text style={styles.groupSection_text}>Group Members</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}>
            {sortedUsers.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
                No group members found.
              </Text>
            ) : (
              sortedUsers.map((user, idx) => (
                <Animated.View
                  key={user.id}
                  entering={FadeInUp.delay(idx * 100)}
                  style={[
                    styles.userCardContainer,
                    {
                      transform: [{ scale: withSpring(1, { damping: 12, stiffness: 120 }) }],
                    },
                  ]}>
                  <View style={styles.userInfoContainer}>
                    <Image source={user.avatar} style={styles.avatar} />
                    <View style={styles.userTextContainer}>
                      <Text style={styles.GroupScreen_userName}>{user.name}</Text>
                      <Text style={styles.userPoints}>{user.totalPoints} pts</Text>
                    </View>
                  </View>
                </Animated.View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </GradientContainer>
  );
}
