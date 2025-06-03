import {View, Text, Button } from 'react-native';

export default function AddTaskScreen({ navigation }: any) {
    return (
        <View>
            <Text>Add a task for your group</Text>
            {/* We add in form fields here */}
            <Button title="Go to Welcome" onPress={() => navigation.navigate('Welcome')} />
        </View>
    );
}