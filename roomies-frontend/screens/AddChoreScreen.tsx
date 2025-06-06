import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { styles } from 'components/style'
import GradientContainer from 'components/GradientContainer';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

export default function AddChoreScreen({ navigation }: any) {
  const [choreName, setChoreName] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedUser, setAssignedUser] = useState("");
  const [choreStatus, setChoreStatus] = useState("todo");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
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
    borderColor: interpolateColor(
      nameBorder.value,
      [0, 1],
      ['#ccc', '#ffcc5c']
    ),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  const animatedDescStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      descBorder.value,
      [0, 1],
      ['#ccc', '#ffcc5c']
    ),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  const animatedRewardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      rewardBorder.value,
      [0, 1],
      ['#ccc', '#ffcc5c']
    ),
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

  const users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
    { id: '4', name: 'David' },
    { id: '5', name: 'Eve' },
    { id: '6', name: 'Suhaim' },
    { id: '7', name: 'Wendy' }
  ];

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };
  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const submitChoreHandler = () => {
    setError(null);
    if (!choreName.trim()) {
      setError('Chore name is required.');
      return;
    }
    if (!assignedUser) {
      setError('Please assign a user.');
      return;
    }
    const newChore = {
      choreName,
      description,
      rewardPoints: Number(rewardPoints),
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
      startDate: startDate ? startDate.toISOString().split('T')[0] : '',
      assignedUser,
      choreStatus,
    };
    console.log("Chore submitted:", newChore)
    //send to backend
  };

  return (
    <GradientContainer>
      <Animated.View style={fadeStyle}>
        <Text style={[styles.title, { marginBottom: 12, alignSelf: 'center' }]}>Add a Chore</Text>
        {error && (
          <View style={{ marginBottom: 12, alignItems: 'center' }}>
            <Text style={{ color: '#e74c3c', fontSize: 14 }}>{error}</Text>
          </View>
        )}
        <Animated.View style={animatedNameStyle}>
          <TextInput
            placeholder="Chore to be added"
            value={choreName}
            onChangeText={setChoreName}
            style={[styles.input, { borderWidth: 0, marginBottom: 0 }]}
            placeholderTextColor="#888"
            onFocus={() => { nameBorder.value = withTiming(1); }}
            onBlur={() => { nameBorder.value = withTiming(0); }}
          />
        </Animated.View>
        <Animated.View style={animatedDescStyle}>
          <TextInput
            placeholder="Chore description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { borderWidth: 0, marginBottom: 0, height: 100, textAlignVertical: 'top' }]}
            placeholderTextColor="#888"
            multiline={true}
            numberOfLines={4}
            onFocus={() => { descBorder.value = withTiming(1); }}
            onBlur={() => { descBorder.value = withTiming(0); }}
          />
        </Animated.View>
        <Animated.View style={animatedRewardStyle}>
          <TextInput
            placeholder="Reward points"
            value={rewardPoints}
            onChangeText={setRewardPoints}
            style={[styles.input, { borderWidth: 0, marginBottom: 0 }]}
            placeholderTextColor="#888"
            keyboardType="numeric"
            onFocus={() => { rewardBorder.value = withTiming(1); }}
            onBlur={() => { rewardBorder.value = withTiming(0); }}
          />
        </Animated.View>
        {/* Start Date Picker */}
        <TouchableOpacity
          onPress={() => Platform.OS !== 'web' && setShowStartPicker(true)}
          style={[styles.input, { justifyContent: 'center', marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#ccc' }]}
          activeOpacity={0.7}
        >
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              style={{ width: '100%', padding: 10, borderRadius: 8, borderColor: '#ccc' }}
            />
          ) : (
            <Text style={{ color: startDate ? '#222' : '#888' }}>
              {startDate ? `Start date: ${startDate.toLocaleDateString()}` : 'Select start date'}
            </Text>
          )}
        </TouchableOpacity>
        {showStartPicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}
        {/* Due Date Picker */}
        <TouchableOpacity
          onPress={() => Platform.OS !== 'web' && setShowDuePicker(true)}
          style={[styles.input, { justifyContent: 'center', marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#ccc' }]}
          activeOpacity={0.7}
        >
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
              onChange={e => setDueDate(e.target.value ? new Date(e.target.value) : null)}
              style={{ width: '100%', padding: 10, borderRadius: 8, borderColor: '#ccc' }}
            />
          ) : (
            <Text style={{ color: dueDate ? '#222' : '#888' }}>
              {dueDate ? `Due date: ${dueDate.toLocaleDateString()}` : 'Select due date'}
            </Text>
          )}
        </TouchableOpacity>
        {showDuePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowDuePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}
        <View style={[styles.input, { padding: 0, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#ccc' }]}>
          <Picker
            selectedValue={assignedUser}
            onValueChange={(itemValue) => setAssignedUser(itemValue)}
            style={{ color: '#222', width: '100%' }}
            dropdownIconColor="#111"
          >
            <Picker.Item label="Select a user" value="" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
            ))}
          </Picker>
        </View>
        <View style={[styles.input, { padding: 0, marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#ccc' }]}>
          <Picker
            selectedValue={choreStatus}
            onValueChange={(itemValue) => setChoreStatus(itemValue)}
            style={{ color: '#222', width: '100%' }}
            dropdownIconColor="#111"
          >
            <Picker.Item label="Change chore status" value="" />
            <Picker.Item label="To do" value="todo" />
            <Picker.Item label="Doing" value="doing" />
            <Picker.Item label="Done" value="done" />
          </Picker>
        </View>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={submitChoreHandler}
            activeOpacity={0.8}
            style={{
              marginTop: 10,
              backgroundColor: '#4f8cff',
              borderRadius: 25,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 2,
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Add Chore</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </GradientContainer>
  );
}