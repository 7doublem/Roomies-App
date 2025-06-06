import { View, Text, Button, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from 'components/style'
import GradientContainer from 'components/GradientContainer';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskScreen({ navigation }: any) {

  const [taskName,setTaskName]= useState("")
  const [description, setDescription] = useState("")
  const [rewardPoints, setRewardPoints] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedUser, setAssignedUser] = useState("")
  const [taskStatus, setTaskStatus] = useState("todo")
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const users = [
  { id: '1', name: 'Alice', points: 120, avatar: require('../assets/bear.png') },
  { id: '2', name: 'Bob', points: 110, avatar: require('../assets/deer.png') },
  { id: '3', name: 'Charlie', points: 100, avatar: require('../assets/turtle.png') },
  { id: '4', name: 'David', points: 90, avatar: require('../assets/bear.png') },
  { id: '5', name: 'Eve', points: 80, avatar: require('../assets/deer.png') },
  { id: '6', name: 'Suhaim', points: 70, avatar: require('../assets/deer.png') },
  { id: '7', name: 'Wendy', points: 150, avatar: require('../assets/deer.png') }
];

  const submitTaskHandler = () => {
    const newTask = {
      taskName,
      description,
      rewardPoints: Number(rewardPoints),
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
      startDate: startDate ? startDate.toISOString().split('T')[0] : '',
      assignedUser,
    };
    console.log("Task submitted:", newTask)
    //send to backend
  };
    //add input validation. 
    //Check date format needed by backend and investigate use of DateTimePicker
  return (
    <GradientContainer>
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <Text style={[styles.title, { marginBottom: 12 }]}>Add a Task</Text>
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 18,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Task to be added"
              value={taskName}
              onChangeText={setTaskName}
              style={[styles.input, { marginBottom: 10 }]}
              placeholderTextColor="#222"
            />
            <TextInput
              placeholder="Task description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 100, textAlignVertical: 'top', marginBottom: 10 }]}
              placeholderTextColor="#222"
              multiline={true}
              numberOfLines={4}
            />
            <TextInput
              placeholder="Reward points"
              value={rewardPoints}
              onChangeText={setRewardPoints}
              style={[styles.input, { marginBottom: 10 }]}
              placeholderTextColor="#222"
              keyboardType="numeric"
            />
            {/* Start Date Picker */}
            <TouchableOpacity
              onPress={() => Platform.OS !== 'web' && setShowStartPicker(true)}
              style={[styles.input, { justifyContent: 'center', marginBottom: 10 }]}
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
              style={[styles.input, { justifyContent: 'center', marginBottom: 10 }]}
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
            <View style={[styles.input, { padding: 0, marginBottom: 10, backgroundColor: 'rgba(240,240,240,0.8)', borderRadius: 8 }]}>
              <Picker
                selectedValue={assignedUser}
                onValueChange={(itemValue) => setAssignedUser(itemValue)}
                style={{ color: '#222', width: '100%' }}
              >
                <Picker.Item label="Select a user" value="" />
                {users.map((user) => (
                  <Picker.Item key={user.id} label={user.name} value={user.id} />
                ))}
              </Picker>
            </View>
            <View style={[styles.input, { padding: 0, marginBottom: 10, backgroundColor: 'rgba(240,240,240,0.8)', borderRadius: 8 }]}>
              <Picker
                selectedValue={taskStatus}
                onValueChange={(itemValue) => setTaskStatus(itemValue)}
                style={{ color: '#222', width: '100%' }}
              >
                <Picker.Item label="Change task status" value="" />
                <Picker.Item label="To do" value="todo" />
                <Picker.Item label="Doing" value="doing" />
                <Picker.Item label="Done" value="done" />
              </Picker>
            </View>
          </View>
          <TouchableOpacity
            onPress={submitTaskHandler}
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
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientContainer>
  );
}