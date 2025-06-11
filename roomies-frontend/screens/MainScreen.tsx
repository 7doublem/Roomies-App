import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import GradientContainer from '../components/GradientContainer';
import { styles } from 'components/style';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable, PanGestureHandler } from 'react-native-gesture-handler';
import ChoresCard from './TabComponents/ChoresCard';
import Confetti from 'react-confetti';
import { useWindowDimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { getAuthToken, apiFetch } from '../api/index';
import dayjs from 'dayjs';
import { getGroupMembers } from '../api/groups';

const tabOrder = ['todo', 'doing', 'done'];

export default function MainScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('todo');
  const [todos, setTodos] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [groupId, setGroupId] = useState<string>(''); // add groupId state
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const { width, height } = useWindowDimensions();

  // Helper to calculate countdown string from dueDate (seconds)
  function getCountdown(dueDate: number) {
    if (!dueDate) return '';
    const now = dayjs();
    const due = dayjs.unix(dueDate);
    const diff = due.diff(now, 'second');
    if (diff <= 0) return 'Overdue';
    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    let str = '';
    if (days > 0) str += `${days}d `;
    if (hours > 0 || days > 0) str += `${hours}h `;
    if (mins > 0 || hours > 0 || days > 0) str += `${mins}m `;
    str += `${secs}s`;
    return str;
  }

  useEffect(() => {
    const fetchChores = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error('Not authenticated');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let groupId = userDoc.data()?.groupId;
        const username = userDoc.data()?.username || '';
        setCurrentUserName(username);
        if (!groupId) throw new Error('No group found');

        // If groupId is a group code (short), resolve to Firestore doc id
        if (groupId.length <= 8) {
          const token = await getAuthToken();
          const res = await apiFetch('/groups', token);
          const groups = await res.json();
          const found = groups.find((g: any) => g.groupCode === groupId);
          if (!found) throw new Error('Group not found');
          groupId = found.groupId;
        }
        setGroupId(groupId);

        // Fetch group members to map UIDs to usernames
        const token = await getAuthToken();
        const members = await getGroupMembers(token, groupId);
        setGroupMembers(members);

        // Fetch all chores for the group from your backend
        const res = await apiFetch(`/groups/${groupId}/chores`, token);
        let chores = await res.json();

        // Defensive: ensure chores is always an array
        if (!Array.isArray(chores)) {
          chores = [];
        }

        // Map assignedTo UID to username for all chores
        const uidToUsername: Record<string, string> = {};
        members.forEach((m: any) => {
          uidToUsername[m.uid] = m.username || m.name || m.email || m.uid;
        });

        const userChores = chores.map((chore: any) => ({
          ...chore,
          assignedTo: uidToUsername[chore.assignedTo] || chore.assignedTo,
          chore: chore.name,
          countdown: getCountdown(chore.dueDate),
          reward: chore.rewardPoints,
        }));

        setTodos(userChores);
      } catch (err) {
        setTodos([]);
      }
    };
    fetchChores();
  }, []);

  const moveChore = async (id: string, direction: 'forward' | 'backward') => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIndex = tabOrder.indexOf(t.status);
        const nextIndex =
          direction === 'forward'
            ? Math.min(currentIndex + 1, tabOrder.length - 1)
            : Math.max(currentIndex - 1, 0);

        // If moving to done, update the assigned user's points in Firestore
        if (tabOrder[nextIndex] === 'done' && t.status !== 'done') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);

          // --- Add points to the assigned user in Firestore ---
          (async () => {
            try {
              // Find the UID of the assigned user (reverse lookup if needed)
              let assignedUid = t.assignedTo;
              // If assignedTo is a username, map it back to UID
              if (groupMembers && groupMembers.length > 0) {
                const found = groupMembers.find(
                  (m: any) =>
                    m.username === t.assignedTo ||
                    m.name === t.assignedTo ||
                    m.email === t.assignedTo
                );
                if (found && found.uid) assignedUid = found.uid;
              }
              // Only update if we have a UID
              if (assignedUid) {
                const userRef = doc(db, 'users', assignedUid);
                await updateDoc(userRef, {
                  rewardPoints: increment(t.reward),
                });
              }
            } catch (err) {
              // handle error if needed
            }
          })();
        }
        return { ...t, status: tabOrder[nextIndex] };
      })
    );
  };

  const handleTabSwipe = (direction: 'left' | 'right') => {
    const currentIndex = tabOrder.indexOf(activeTab);
    let newIndex = currentIndex;
    if (direction === 'left' && currentIndex < tabOrder.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'right' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    if (newIndex !== currentIndex) {
      setActiveTab(tabOrder[newIndex]);
    }
  };

  const renderScreen = () => {
    const filtered = todos.filter((t) => t.status === activeTab);
    return (
      <>
        {filtered.map((item) => (
          <Swipeable
            key={item.id}
            onSwipeableLeftOpen={() => moveChore(item.id, 'backward')}
            onSwipeableRightOpen={() => moveChore(item.id, 'forward')}
            renderLeftActions={() => (
              <View style={styles.swipeActionLeft}>
                <Ionicons name="arrow-back-circle" size={32} color="white" />
              </View>
            )}
            renderRightActions={() => (
              <View style={styles.swipeActionRight}>
                <Ionicons name="arrow-forward-circle" size={32} color="white" />
              </View>
            )}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChoreDetail', {
                  groupId: groupId,
                  choreId: item.id,
                })
              }>
              <ChoresCard
                status={item.status}
                chore={item.chore}
                assignedTo={item.assignedTo}
                countdown={item.countdown}
                reward={item.reward}
              />
            </TouchableOpacity>
          </Swipeable>
        ))}
      </>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientContainer>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainScreen_container_Text}>My Chores</Text>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            {tabOrder.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}>
                <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Confetti */}
          {showConfetti && (
            <Confetti width={width} height={height} numberOfPieces={180} recycle={false} />
          )}
          {/* Swipe horizontally to change tabs */}
          <PanGestureHandler
            onGestureEvent={({ nativeEvent }) => {
              if (nativeEvent.translationX > 50) {
                handleTabSwipe('right');
              } else if (nativeEvent.translationX < -50) {
                handleTabSwipe('left');
              }
            }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
              {renderScreen()}
            </ScrollView>
          </PanGestureHandler>
        </View>
      </GradientContainer>
    </GestureHandlerRootView>
  );
}
