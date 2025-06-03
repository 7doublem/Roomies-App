import {View, Text, Button } from 'react-native';

export default function LeaderboardScreen({ navigation }: any) {
    return (
        <View>
            <Text>Check the leaderboard</Text>
            {/* We add in form fields here */}
            <Button title="Go to Welcome" onPress={() => navigation.navigate('Welcome')} />
        </View>
    );
}