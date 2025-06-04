import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useState } from 'react';
import GradientContainer from '../components/GradientContainer';
import { styles } from 'components/style';
import TodoScreen from './TabComponents/TodoScreen';
import DoingScreen from './TabComponents/DoingScreen';
import DoneScreen from './TabComponents/DoneScreen';
const Tab = createMaterialTopTabNavigator();
export default function MainScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('todo');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoScreen />;
      case 'doing':
        return <DoingScreen />;
      case 'done':
        return <DoneScreen />;
      default:
        return null;
    }
  };
  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.mainScreen_container_Text}>My Chores</Text>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'todo' && styles.activeTab]}
            onPress={() => setActiveTab('todo')}>
            <Text style={styles.tabText}>To Do</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'doing' && styles.activeTab]}
            onPress={() => setActiveTab('doing')}>
            <Text style={styles.tabText}>Doing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'done' && styles.activeTab]}
            onPress={() => setActiveTab('done')}>
            <Text style={styles.tabText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Component */}
        <View style={{ flex: 1 }}>{renderTabContent()}</View>
      </View>
    </GradientContainer>
  );
}
