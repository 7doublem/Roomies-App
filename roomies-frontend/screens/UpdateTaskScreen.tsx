import { View, Text, Button, TextInput } from 'react-native';
import GradientContainer from 'components/GradientContainer';
import { styles } from 'components/style'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';

const originalTask = 
  {
    taskId: 1,
    taskName: 'Take out rubbish',
    description: 'Take all rubbish out to the wheelie bins, and put the wheelie bins by the roadside, before the end of the day.',
    rewardPoints: 10,
    dueDate: '2025-06-12',
    startDate: '2025-06-05',
    assignedUser: 'Wendy',
    taskStatus: 'todo',
  }

export default function UpdateTaskScreen({ navigation }: any) {
  const [task, setTask] = useState({ ...originalTask })

  const updateTaskHandler = () => {
    console.log("Task updated", task)
    //Show message saying task has been updated? Or go back to TaskDetailScreen?
  }
  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} >Update a Task</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Task Name"
            value={task.taskName}
            onChange={(text) => setTask({ ...task, taskName: text })}
            style={styles.input}
            placeholderTextColor="#222"
          />
                    <TextInput
            placeholder="Description"
            value={task.description}
            onChangeText={(text) => setTask({ ...task, description: text })}
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            multiline
            placeholderTextColor="#222"
          />
          <TextInput
            placeholder="Reward Points"
            value={String(task.rewardPoints)}
            onChangeText={(text) => setTask({ ...task, rewardPoints: text })}
            style={styles.input}
            placeholderTextColor="#222"
          />
          <TextInput
            placeholder="Start Date"
            value={task.startDate}
            onChangeText={(text) => setTask({ ...task, startDate: text })}
            style={styles.input}
            placeholderTextColor="#222"
          />
          <TextInput
            placeholder="Due Date"
            value={task.dueDate}
            onChangeText={(text) => setTask({ ...task, dueDate: text })}
            style={styles.input}
            placeholderTextColor="#222"
          />

          <View style={styles.input}>
            <Picker
              selectedValue={task.assignedUser}
              onValueChange={(value) => setTask({ ...task, assignedUser: value })}
              style={{ color: '#222' }}
            >
              <Picker.Item label="Wendy" value="Wendy" />
              <Picker.Item label="Wai" value="Wai" />
              <Picker.Item label="Suhaim" value="Suhaim" />
            </Picker>
          </View>

          <View style={styles.input}>
            <Picker
              selectedValue={task.taskStatus}
              onValueChange={(value) => setTask({ ...task, taskStatus: value })}
              style={{ color: '#222' }}
            >
              <Picker.Item label="To Do" value="todo" />
              <Picker.Item label="Doing" value="doing" />
              <Picker.Item label="Done" value="done" />
            </Picker>
          </View>
        </View>

        <View style={styles.button}>
          <Button title="Update Task" onPress={updateTaskHandler} color="#111" />
        </View>
      </View>
    </GradientContainer>
  );
}