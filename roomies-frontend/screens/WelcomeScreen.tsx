import {View, Text, Button } from 'react-native';

export default function WelcomeScreen({ navigation }: any) {
    return (
        <View>
            <Text>Welcome to Roomies</Text>
            {/* We add in form fields here */}
            <Button title="Go to Main" onPress={() => navigation.navigate('Main')} />
        </View>
    );
}