import { View, Text, Button } from 'react-native';
import GradientContainer from 'components/GradientContainer';
import { styles } from 'components/style'

export default function SocialScreen({ navigation }: any) {
  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} >Social</Text>
      </View>
    </GradientContainer>
  );
}
