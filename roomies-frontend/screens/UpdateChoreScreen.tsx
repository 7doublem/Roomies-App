import { View, Text, TextInput, ScrollView } from 'react-native';
import GradientContainer from 'components/GradientContainer';
import { styles } from 'components/style';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const originalChore = {
  choreId: 1,
  choreName: 'Take out rubbish',
  description:
    'Take all rubbish out to the wheelie bins, and put the wheelie bins by the roadside, before the end of the day.',
  rewardPoints: 10,
  dueDate: '2025-06-12',
  startDate: '2025-06-05',
  assignedUser: 'Wendy',
  choreStatus: 'todo',
};

export default function UpdateChoreScreen({ navigation }: any) {
  const [chore, setChore] = useState({ ...originalChore });
  const [error, setError] = useState<string | null>(null);

  // Animated values
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }));

  const nameBorder = useSharedValue(0);
  const descBorder = useSharedValue(0);
  const rewardBorder = useSharedValue(0);

  const animatedNameStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(nameBorder.value, [0, 1], ['#ccc', '#ffcc5c']),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  const animatedDescStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(descBorder.value, [0, 1], ['#ccc', '#ffcc5c']),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  const animatedRewardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(rewardBorder.value, [0, 1], ['#ccc', '#ffcc5c']),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  // Fade-in animation
  const fade = useSharedValue(0);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  React.useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
  }, []);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };
  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const updateChoreHandler = () => {
    setError(null);
    if (!chore.choreName.trim()) {
      setError('Chore name is required.');
      return;
    }
    if (!chore.assignedUser) {
      setError('Please assign a user.');
      return;
    }
    console.log('Chore updated', chore);
    //Show message saying chore has been updated? Or go back to ChoreDetailScreen?
  };

  return (
    <GradientContainer>
      <ScrollView>
        <Animated.View style={fadeStyle}>
          <Text style={[styles.title, { marginBottom: 16, alignSelf: 'center' }]}>
            Update a Chore
          </Text>
          {error && (
            <View style={{ marginBottom: 12, alignItems: 'center' }}>
              <Text style={{ color: '#e74c3c', fontSize: 14 }}>{error}</Text>
            </View>
          )}
          <Animated.View style={animatedNameStyle}>
            <TextInput
              placeholder="Chore Name"
              value={chore.choreName}
              onChangeText={(text) => setChore({ ...chore, choreName: text })}
              style={[styles.input, { borderWidth: 0, marginBottom: 0 }]}
              placeholderTextColor="#222"
              onFocus={() => {
                nameBorder.value = withTiming(1);
              }}
              onBlur={() => {
                nameBorder.value = withTiming(0);
              }}
            />
          </Animated.View>
          <Animated.View style={animatedDescStyle}>
            <TextInput
              placeholder="Description"
              value={chore.description}
              onChangeText={(text) => setChore({ ...chore, description: text })}
              style={[
                styles.input,
                {
                  height: 100,
                  textAlignVertical: 'top',
                  borderWidth: 0,
                  marginBottom: 0,
                  padding: 10,
                },
              ]}
              multiline
              placeholderTextColor="#222"
              onFocus={() => {
                descBorder.value = withTiming(1);
              }}
              onBlur={() => {
                descBorder.value = withTiming(0);
              }}
            />
          </Animated.View>
          <Animated.View style={animatedRewardStyle}>
            <TextInput
              placeholder="Reward Points"
              value={String(chore.rewardPoints)}
              onChangeText={(text) => setChore({ ...chore, rewardPoints: text })}
              style={[styles.input, { borderWidth: 0, marginBottom: 0 }]}
              placeholderTextColor="#222"
              keyboardType="numeric"
              onFocus={() => {
                rewardBorder.value = withTiming(1);
              }}
              onBlur={() => {
                rewardBorder.value = withTiming(0);
              }}
            />
          </Animated.View>
          <TextInput
            placeholder="Start Date"
            value={chore.startDate}
            onChangeText={(text) => setChore({ ...chore, startDate: text })}
            style={[
              styles.input,
              {
                marginBottom: 16,
                borderRadius: 8,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#ccc',
              },
            ]}
            placeholderTextColor="#222"
          />
          <TextInput
            placeholder="Due Date"
            value={chore.dueDate}
            onChangeText={(text) => setChore({ ...chore, dueDate: text })}
            style={[
              styles.input,
              {
                marginBottom: 16,
                borderRadius: 8,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#ccc',
              },
            ]}
            placeholderTextColor="#222"
          />
          <View
            style={[
              styles.input,
              {
                padding: 0,
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#ccc',
              },
            ]}>
            <Picker
              selectedValue={chore.assignedUser}
              onValueChange={(value) => setChore({ ...chore, assignedUser: value })}
              style={styles.input}
              dropdownIconColor="#111">
              <Picker.Item label="Wendy" value="Wendy" />
              <Picker.Item label="Wai" value="Wai" />
              <Picker.Item label="Suhaim" value="Suhaim" />
            </Picker>
          </View>
          <View
            style={[
              styles.input,
              {
                padding: 0,
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#ccc',
              },
            ]}>
            <Picker
              selectedValue={chore.choreStatus}
              onValueChange={(value) => setChore({ ...chore, choreStatus: value })}
              style={styles.input}
              dropdownIconColor="#111">
              <Picker.Item label="To Do" value="todo" />
              <Picker.Item label="Doing" value="doing" />
              <Picker.Item label="Done" value="done" />
            </Picker>
          </View>
          <Animated.View style={animatedButtonStyle}>
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  backgroundColor: '#4f8cff',
                  borderRadius: 25,
                  height: 50,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingTop: 12,
                  shadowColor: '#000',
                  shadowOpacity: 0.12,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={updateChoreHandler}>
                Update Chore
              </Text>
            </View>
          </Animated.View>
          <Animated.View style={animatedButtonStyle}>
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  backgroundColor: 'rgb(255, 111, 105)',
                  borderRadius: 25,
                  height: 50,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingTop: 12,
                  shadowColor: '#000',
                  shadowOpacity: 0.12,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={updateChoreHandler}>
                Delete Chore
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </GradientContainer>
  );
}
