import { View, Text,  TouchableOpacity } from 'react-native';
import { styles } from 'components/style';
import GradientContainer from '../components/GradientContainer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CommentSection from '../components/CommentSection';


export default function ChoreDetailScreen({ navigation, route }: any) {
  const { groupId, choreId } = route.params;

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskDetail_Screen_text}>Chore Details</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('UpdateChoreScreen')}
        >
          <MaterialIcons name="mode-edit" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.card}>
          {/* Reward badge */}
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardText}>10</Text>
          </View>

          {/* Chore info */}
          <Text style={styles.choreName}>Wash the dishes</Text>
          <Text style={styles.assignedTo}>👤 Assigned to: Suhaim</Text>
          <Text style={styles.countdown}>⏳ Countdown: 1d 20m 30s</Text>
          <Text style={styles.startdate}>⏳ Start Date: 5 June 2025</Text>
        </View>

        {/* Import Comment Section */}
        <CommentSection groupId={groupId} choreId={choreId} />
      </View>
    </GradientContainer>
  );
}
