import {View, Text, Button ,TextInput,TouchableOpacity} from 'react-native';
import React, { useState } from 'react';

export default function WelcomeScreen({ navigation }: any) {

    const [username,setUsername]= useState("")
    const [groupId, setGroupId]=useState("")

    const joinInHandler=()=>{
       console.log("Join In ID", groupId)
    }

    const createGroupHandler=()=>{
        console.log("Create Group")
    }

    return (
        <View>
            <Text>Welcome to Roomies</Text>
            <Text>{username}</Text>
            <Text>The app that will make</Text>
             <Text>Your tasks look funny!</Text>
             <Text>Join Group by ID</Text>
            <View>
                <TextInput  placeholder="Group ID"
                value={groupId}
                onChangeText={setGroupId}
                autoCapitalize="none"
                />
                <TouchableOpacity activeOpacity={0.8} >
                <Button title="Join In" onPress={joinInHandler}/>
                </TouchableOpacity>
            </View>

            <Text>or</Text>

            <TouchableOpacity>
                <Button title="Create a group" onPress={createGroupHandler}/>
            </TouchableOpacity>
            {/* We add in form fields here */}
            <Button title="Go to Main" onPress={() => navigation.navigate('Main')} />
        </View>
    );
}