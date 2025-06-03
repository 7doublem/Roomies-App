import {View, Text, Button } from 'react-native';

export default function MainScreen({ navigation }: any) {
    return (
        <View>
            <Text>Main Screen</Text>
            {/* We add in form fields here */}
            <Button title="Go to Welcome" onPress={() => navigation.navigate('Welcome')} />
        </View>
    );
}