import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import GradientContainer from '../components/GradientContainer';
import { styles } from 'components/style';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable, PanGestureHandler } from 'react-native-gesture-handler';
import ChoresCard from './TabComponents/ChoresCard';
import Confetti from 'react-confetti';
import { useWindowDimensions } from 'react-native';

const tabOrder = ['todo', 'doing', 'done'];

export default function MainScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('todo');
  const [todos, setTodos] = useState([
    {
      id: 1,
      status: 'todo',
      chore: 'Wash the dishes',
      assignedTo: 'John',
      countdown: '1d 20m 30s',
      reward: 40,
    },
    {
      id: 2,
      status: 'todo',
      chore: 'Vacuum the living room',
      assignedTo: 'Wendy',
      countdown: '1d 20m 30s',
      reward: 40,
    },
    {
      id: 3,
      status: 'todo',
      chore: 'Take out the trash',
      assignedTo: 'Emma',
      countdown: '1d 20m 30s',
      reward: 70,
    },
  ]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowDimensions();

  const moveChore = (id: number, direction: 'forward' | 'backward') => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIndex = tabOrder.indexOf(t.status);
        const nextIndex =
          direction === 'forward'
            ? Math.min(currentIndex + 1, tabOrder.length - 1)
            : Math.max(currentIndex - 1, 0);
        // Show confetti if moving to done
        if (tabOrder[nextIndex] === 'done' && t.status !== 'done') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
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
            <TouchableOpacity onPress={() => navigation.navigate('ChoreDetail', { id: item.id })}>
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
