import {View, Text, Button } from 'react-native';

export default function GroupScreen({ navigation }: any) {
    return (
        <View>
            <Text>Your Group</Text>
            {/* We add in form fields here */}
            <Button title="Go to Welcome" onPress={() => navigation.navigate('Welcome')} />
        </View>
    );
}