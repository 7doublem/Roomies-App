import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from 'components/style';
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
  const [choreName, setChoreName] = useState('');
  const [description, setDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedUser, setAssignedUser] = useState('');
  const [choreStatus, setChoreStatus] = useState('todo');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
    { id: '4', name: 'David' },
    { id: '5', name: 'Eve' },
    { id: '6', name: 'Suhaim' },
    { id: '7', name: 'Wendy' },
  ];

  // Shared animated values
  const buttonScale = useSharedValue(1);
  const fade = useSharedValue(0);
  const nameBorder = useSharedValue(0);
  const descBorder = useSharedValue(0);
  const rewardBorder = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }));

  const animatedInput = (borderValue: any) =>
    useAnimatedStyle(() => ({
      borderColor: interpolateColor(borderValue.value, [0, 1], ['#ccc', '#ffcc5c']),
      borderWidth: 2,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 10,
    }));

  const animatedNameStyle = animatedInput(nameBorder);
  const animatedDescStyle = animatedInput(descBorder);
  const animatedRewardStyle = animatedInput(rewardBorder);

  const handlePressIn = () => (buttonScale.value = withSpring(0.96));
  const handlePressOut = () => (buttonScale.value = withSpring(1));

  const submitChoreHandler = () => {
    setError(null);
    if (!choreName.trim()) return setError('Chore name is required.');
    if (!assignedUser) return setError('Please assign a user.');

    const newChore = {
      choreName,
      description,
      rewardPoints: Number(rewardPoints),
      startDate: startDate ? startDate.toISOString().split('T')[0] : '',
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
      assignedUser,
      choreStatus,
    };

    console.log('Chore submitted:', newChore);
    // You can now send this to Firestore here
  };

  return (
    <GradientContainer>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}>
        <Animated.View style={fadeStyle}>
          <Text style={[styles.title, { marginBottom: 12, alignSelf: 'center' }]}>Add a Chore</Text>

          {error && (
            <Text style={{ color: '#e74c3c', fontSize: 14, marginBottom: 12 }}>{error}</Text>
          )}

          <TextInput
            placeholder="Chore to be added"
            value={choreName}
            onChangeText={setChoreName}
            placeholderTextColor="#888"
            onFocus={() => (nameBorder.value = withTiming(1))}
            onBlur={() => (nameBorder.value = withTiming(0))}
            style={styles.input}
          />

          <TextInput
            placeholder="Chore description"
            value={description}
            onChangeText={setDescription}
            style={[
              styles.input,
              { height: 120, textAlignVertical: 'top', paddingTop: 5, marginTop: 10 },
            ]}
            placeholderTextColor="#888"
            multiline
            numberOfLines={6}
            onFocus={() => (descBorder.value = withTiming(1))}
            onBlur={() => (descBorder.value = withTiming(0))}
          />

          <TextInput
            placeholder="Reward points"
            value={rewardPoints}
            onChangeText={setRewardPoints}
            placeholderTextColor="#888"
            keyboardType="numeric"
            onFocus={() => (rewardBorder.value = withTiming(1))}
            onBlur={() => (rewardBorder.value = withTiming(0))}
            style={[styles.input, { marginTop: 10 }]}
          />

          {/* Start Date Picker */}
          {Platform.OS === 'web' ? (
            <View>
              <Text style={styles.addChoreScreen_label}>Start Time:</Text>
              <input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '2px solid #ccc',
                  fontSize: 16,
                  backgroundColor: '#fff',
                  color: '#333',
                  marginBottom: 5,
                  boxSizing: 'border-box',
                }}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={{
                  borderColor: '#ccc',
                  borderWidth: 2,
                  borderRadius: 8,
                  marginBottom: 16,
                  backgroundColor: '#fff',
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}>
                <Text style={{ color: startDate ? '#222' : '#888', fontSize: 16 }}>
                  {startDate
                    ? `Start date: ${startDate.toLocaleDateString()}`
                    : 'Select start date'}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                />
              )}
            </>
          )}

          {/* Due Date Picker */}
          {Platform.OS === 'web' ? (
            <View>
              <Text style={styles.addChoreScreen_label}>End Time:</Text>
              <input
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '2px solid #ccc',
                  fontSize: 16,
                  backgroundColor: '#fff',
                  color: '#333',

                  boxSizing: 'border-box',
                }}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowDuePicker(true)}
                style={{
                  borderColor: '#ccc',
                  borderWidth: 2,
                  borderRadius: 8,
                  marginBottom: 16,
                  backgroundColor: '#fff',
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}>
                <Text style={{ color: dueDate ? '#222' : '#888', fontSize: 16 }}>
                  {dueDate ? `Due date: ${dueDate.toLocaleDateString()}` : 'Select due date'}
                </Text>
              </TouchableOpacity>
              {showDuePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setShowDuePicker(false);
                    if (date) setDueDate(date);
                  }}
                />
              )}
            </>
          )}

          {/* Assigned User Picker */}
          <View>
            <Picker
              selectedValue={assignedUser}
              onValueChange={setAssignedUser}
              style={[styles.input, { marginTop: 10 }]}
              dropdownIconColor="#111"
              mode="dropdown">
              <Picker.Item label="Select a user" value="" />
              {users.map((user) => (
                <Picker.Item key={user.id} label={user.name} value={user.id} />
              ))}
            </Picker>
          </View>

          {/* Chore Status Picker */}
          <View>
            <Picker
              selectedValue={choreStatus}
              onValueChange={setChoreStatus}
              style={[styles.input, { marginTop: 10 }]}
              dropdownIconColor="#111"
              mode="dropdown">
              <Picker.Item label="Change chore status" value="todo" />
              <Picker.Item label="Doing" value="doing" />
              <Picker.Item label="Done" value="done" />
            </Picker>
          </View>

          {/* Submit Button */}
          <Animated.View
            style={[
              animatedButtonStyle,
              {
                shadowColor: 'transparent',
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              },
            ]}>
            <TouchableOpacity
              onPress={submitChoreHandler}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
              style={{
                marginTop: 16,
                backgroundColor: '#4f8cff',
                borderRadius: 25,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Add Chore</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </GradientContainer>
  );
}
