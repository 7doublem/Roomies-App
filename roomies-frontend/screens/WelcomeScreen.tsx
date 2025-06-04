import {View, Text, Button ,TextInput,TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {styles} from '../components/style'
export default function WelcomeScreen({ navigation }: any) {

    const [username,setUsername]= useState("")
    const [groupId, setGroupId]=useState("")

    const joinInHandler=()=>{
       console.log("Join In ID", groupId)
    }

    const createGroupHandler=()=>{
        console.log("Create Group")
    };

    return (
        <LinearGradient
      colors={['#96ceb4', '#ffeead', '#ffcc5c', '#ff6f69']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >

        <View style={styles.container}>
            <Text style={styles.text} >Welcome to Roomies</Text>
            <Text style={styles.text}>{username}</Text>
            <Text style={styles.text}>The app that will make</Text>
             <Text style={styles.text}>Your tasks look funny!</Text>
             <Text style={styles.text}>Join Group by ID</Text>
            <View style={styles.inputContainer}>
                <TextInput  placeholder="Group ID"
                value={groupId}
                onChangeText={setGroupId}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#222"
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.button}>
                <Button title="Join In" onPress={joinInHandler} color="#111"/>
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>or</Text>

            <TouchableOpacity style={styles.button}>
                <Button title="Create a group" onPress={createGroupHandler} color="#111"/>
            </TouchableOpacity>
            {/* We add in form fields here */}
            <Button title="Go to Main" onPress={() => navigation.navigate('Main')} color="#111"/>
        </View>
        </LinearGradient>
    );
}



