import { View, Text, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { styles } from 'components/style';
import GradientContainer from '../components/GradientContainer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CommentSection from '../components/CommentSection';

// Define props with TypeScript

export default function TaskDetailScreen() {
  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskDetail_Screen_text}>Task Details</Text>

        <TouchableOpacity style={styles.editBtn}>
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
        <CommentSection />
      </View>
    </GradientContainer>
  );
}
