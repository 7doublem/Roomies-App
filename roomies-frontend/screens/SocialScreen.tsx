import {View, Text, Button } from 'react-native';

export default function SocialScreen({ navigation }: any) {
    return (
        <View>
            <Text>Social</Text>
            {/* We add in form fields here */}
            <Button title="Go to Welcome" onPress={() => navigation.navigate('Welcome')} />
        </View>
    );
}