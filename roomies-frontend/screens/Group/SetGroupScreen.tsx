import {View, Text, Button } from 'react-native';
import React, { useState } from 'react';
export default function SetGroupScreen({ navigation }: any) {
    const [groupName,setGroupName]=useState("")
    const [adduserName,setAddUserName]=useState("")


    const joinInHandler=()=>{
        console.log("Join in")
    }

    return (
        <View>
            <Text>Set up your group here</Text>
            {/* We add in form fields here */}
           <TextInput  placeholder="Name of Group"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="none"
                />
      
          
             <Text>Search user</Text>
            <View>
                <TextInput  placeholder="UserName"
                value={adduserName}
                onChangeText={setAddUserName}
                autoCapitalize="none"
                />
                <TouchableOpacity activeOpacity={0.8} >
                <Button title="Join In" onPress={joinInHandler}/>
                </TouchableOpacity>
            </View>

            <Text>or</Text>

            <TouchableOpacity>
                <Button title="Create Group" onPress={createGroupHandler}/>
            </TouchableOpacity>
            {/* We add in form fields here */}
             <Button title="Go to Group" onPress={() => navigation.navigate('Group')} />
        </View>
    );
}