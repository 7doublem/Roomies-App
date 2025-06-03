import {View, Text, Button } from 'react-native';
import React, { useState } from 'react';
export default function SetGroupScreen({ navigation }: any) {
    const [groupName,setGroupName]=useState("")
    const [adduserName,setAddUserName]=useState("")
    return (
        <View>
            <Text>Set up your group here</Text>
            {/* We add in form fields here */}
           <TextInput  placeholder="Group ID"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="none"
                />
      
          
             <Text>Search user</Text>
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
             <Button title="Go to Group" onPress={() => navigation.navigate('Group')} />
        </View>
    );
}