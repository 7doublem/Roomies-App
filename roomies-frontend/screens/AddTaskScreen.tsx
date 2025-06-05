import {View, Text, Button ,TextInput,TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from 'components/style'
import GradientContainer from 'components/GradientContainer';
import { Picker } from '@react-native-picker/picker';

export default function AddTaskScreen({ navigation }: any) {

  const [taskName,setTaskName]= useState("")
  const [description, setDescription] = useState("")
  const [rewardPoints, setRewardPoints] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [assignedUser, setAssignedUser] = useState("")
  const [taskStatus, setTaskStatus] = useState("todo")
  const [startDate, setStartDate] = useState("");
  const [showStartPicker, setShowPicker] = useState(false)

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
      dueDate,
      startDate,
      assignedUser,
    };
    console.log("Task submitted:", newTask)
    //send to backend
  };
    //add input validation. 
    //Check date format needed by backend and investigate use of DateTimePicker
  return (
        <GradientContainer>
        <View style={{ flex: 1 }}>
            <Text style={styles.title} >Add a Task</Text>
            <View style={styles.inputContainer}>
                <TextInput  placeholder="Task to be added"
                value={taskName}
                onChangeText={setTaskName}
                style={styles.input}
                placeholderTextColor="#222"
            />
                <TextInput  placeholder="Task description"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholderTextColor="#222"
            multiline={true}
            numberOfLines={4}
            />
                <TextInput  placeholder="Reward points"
                value={rewardPoints}
              onChangeText={setRewardPoints}
                style={styles.input}
                placeholderTextColor="#222"
            />
                <TextInput  placeholder="Start date"
                value={startDate}
                onChangeText={setStartDate}
                style={styles.input}
                placeholderTextColor="#222"
          />
                <TextInput  placeholder="Due date"
                value={dueDate}
                onChangeText={setDueDate}
                style={styles.input}
                placeholderTextColor="#222"
            />
          <View style={styles.input}>
            <Picker
              selectedValue={assignedUser}
              onValueChange={(itemValue) => setAssignedUser(itemValue)}
              style={{ color: '#222' }}
            >
              <Picker.Item label="Select a user" value="" />
              {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
              ))}
            </Picker>
          </View>
          <View style={styles.input}>
            <Picker
              selectedValue={taskStatus}
              onValueChange={(itemValue) => setTaskStatus(itemValue)}
              style={{ color: '#222' }}
            >
              <Picker.Item label="Change task status" value="" />
              <Picker.Item label="To do" value="todo" />
              <Picker.Item label="Doing" value="doing" />
              <Picker.Item label="Done" value="done" />
            </Picker>
          </View>
              </View>   
          <View style={styles.button}>
            <Button title="Add task" onPress={submitTaskHandler} color="#111" />
          </View>
        </View>
      </GradientContainer>
    );
}