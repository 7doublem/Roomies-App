import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from 'components/style';
import GradientContainer from 'components/GradientContainer';
import Animated, { FadeInUp, withSpring } from 'react-native-reanimated';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuthToken, apiFetch } from '../../api/index';
import { getAllGroups } from '../../api/groups';

export default function GroupScreen({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        // Fetch all groups and find the group where the user is a member
        const token = await getAuthToken();
        const allGroups = await getAllGroups(token);
        const group = allGroups.find(
          (g: any) => Array.isArray(g.members) && g.members.includes(user.uid)
        );
        if (!group) {
          setUsers([]);
          setGroupCode(null);
          setGroupName(null);
          return;
        }
        const groupId = group.groupId;

        // Fetch group members (UIDs) and group info from backend using the group's groupId
        const res = await apiFetch(`/groups/${groupId}/members`, token);
        const membersResponse = await res.json();

        // --- Ensure groupCode is set from group object ---
        setGroupCode(group.groupCode || null);

        setGroupName(membersResponse.groupName || null);

        // Defensive: handle if membersResponse.members is an array of objects or strings
        let uids: string[] = [];
        const memberUids = membersResponse.members || membersResponse; // fallback if response is just an array
        if (Array.isArray(memberUids)) {
          if (typeof memberUids[0] === 'string') {
            uids = memberUids;
          } else if (typeof memberUids[0] === 'object' && memberUids[0]?.uid) {
            uids = memberUids.map((u: any) => u.uid);
          }
        }

        // Fetch each user document by UID
        let members: any[] = [];
        if (uids.length > 0) {
          members = await Promise.all(
            uids.map(async (uid: string) => {
              try {
                const userDoc = await getDoc(doc(db, 'users', uid));
                const userData = userDoc.data();
                return {
                  id: uid,
                  name: userData?.username || userData?.name || 'Unknown',
                  totalPoints: userData?.rewardPoints ?? userData?.totalPoints ?? 0,
                  avatar: userData?.avatarUrl
                    ? { uri: userData.avatarUrl }
                    : require('assets/bear.png'),
                };
              } catch (e) {
                return null;
              }
            })
          );
          members = members.filter(Boolean);
        }
        setUsers(members);
      } catch (err) {
        setUsers([]);
        setGroupCode(null);
        setGroupName(null);
      }
    };
    fetchGroupMembers();
  }, []);

  const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{groupName || 'Your Group'}</Text>
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