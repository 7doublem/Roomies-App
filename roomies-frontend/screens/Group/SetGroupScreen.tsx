import {View, Text, Button } from 'react-native';

export default function SetGroupScreen({ navigation }: any) {
    return (
        <View>
            <Text>Set up your group here</Text>
            {/* We add in form fields here */}
            <Button title="Go to Group" onPress={() => navigation.navigate('Group')} />
        </View>
    );
}