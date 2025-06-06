import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useState } from 'react';
import GradientContainer from '../components/GradientContainer';
import { styles } from 'components/style';
import TodoScreen from './TabComponents/TodoScreen';
import ChoresCard from './TabComponents/ChoresCard';
import { DraxProvider, DraxView, DraxScrollView } from 'react-native-drax';
import Confetti from 'react-confetti'; // Only works on web
import { useWindowDimensions } from 'react-native';

// Only import react-dnd on web to avoid native errors
let DndProvider: any, HTML5Backend: any, useDrag: any, useDrop: any;
if (Platform.OS === 'web') {
  // @ts-ignore
  ({ DndProvider } = require('react-dnd'));
  // @ts-ignore
  ({ HTML5Backend } = require('react-dnd-html5-backend'));
  // @ts-ignore
  ({ useDrag, useDrop } = require('react-dnd'));
}

// import ConfettiCannon from 'react-native-confetti-cannon'; // <-- UNCOMMENT THIS LINE for native

const SCREEN_WIDTH = Dimensions.get('window').width;

// Web drag-and-drop card
function WebDraggableChoreCard({ chore, onPress }: any) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHORE',
    item: { id: chore.id, status: chore.status },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [chore.id, chore.status]);

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 12,
        cursor: 'move',
      }}
      onClick={onPress}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onPress(); }}
    >
      <ChoresCard
        status={chore.status}
        chore={chore.chore}
        assignedTo={chore.assignedTo}
        countdown={chore.countdown}
        reward={chore.reward}
      />
    </div>
  );
}

function WebDropZone({ children, onDrop, acceptStatus }: any) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'CHORE',
    drop: (item: any) => {
      onDrop(item.id, item.status);
    },
    canDrop: (item: any) => item.status !== acceptStatus,
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onDrop, acceptStatus]);

  return (
    <div
      ref={drop}
      style={{
        minHeight: 120,
        border: '2px dashed #b2dfdb',
        borderRadius: 10,
        padding: 4,
        background: isOver ? '#b3e5fc' : '#e0f7fa',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

export default function MainScreen({ navigation }: any) {
  const [chores, setChores] = useState([
    { id: 1, status: 'todo', chore: 'Wash the dishes', assignedTo: 'John', countdown: '1d 20m 30s', reward: 40 },
    { id: 2, status: 'todo', chore: 'Vacuum the living room', assignedTo: 'Wendy', countdown: '1d 20m 30s', reward: 40 },
    { id: 3, status: 'done', chore: 'Take out the trash', assignedTo: 'Emma', countdown: '1d 20m 30s', reward: 70 },
    // ...other chores...
  ]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowDimensions();

  const doingChores = chores.filter(c => c.status === 'doing');
  const doneChores = chores.filter(c => c.status === 'done');

  const updateChoreStatus = (id: number, newStatus: string) => {
    setChores(chores =>
      chores.map(chore =>
        chore.id === id ? { ...chore, status: newStatus } : chore
      )
    );
    if (newStatus === 'done') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000); // Show confetti for 5 seconds
    }
  };

  const handleChoreDetail = (chore: any) => {
    navigation.navigate('ChoreDetail', { choreId: chore.id });
  };

  if (Platform.OS === 'web') {
    // Web drag-and-drop UI using react-dnd, support To Do <-> Done only
    const todoChores = chores.filter(c => c.status === 'todo');
    return (
      <GradientContainer>
        {showConfetti && (
          <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />
        )}
        <DndProvider backend={HTML5Backend}>
          <Text style={styles.mainScreen_container_Text}>My Chores</Text>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
            {/* To Do List as Drop Zone */}
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 12,
              padding: 8,
              minHeight: 300,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, textAlign: 'center', color: '#333' }}>To Do</Text>
              <WebDropZone
                acceptStatus="todo"
                onDrop={(id: number, status: string) => {
                  if (status !== 'todo') updateChoreStatus(id, 'todo');
                }}
              >
                {todoChores.length === 0 && (
                  <Text style={{ color: '#aaa', textAlign: 'center', marginVertical: 16 }}>Drop here</Text>
                )}
                {todoChores.map((chore) => (
                  <WebDraggableChoreCard
                    key={chore.id}
                    chore={chore}
                    onPress={() => handleChoreDetail(chore)}
                  />
                ))}
              </WebDropZone>
            </div>
            {/* Done List as Drop Zone */}
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 12,
              padding: 8,
              minHeight: 300,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, textAlign: 'center', color: '#333' }}>Done</Text>
              <WebDropZone
                acceptStatus="done"
                onDrop={(id: number, status: string) => {
                  if (status !== 'done') updateChoreStatus(id, 'done');
                }}
              >
                {doneChores.length === 0 && (
                  <Text style={{ color: '#aaa', textAlign: 'center', marginVertical: 16 }}>Drop here</Text>
                )}
                {doneChores.map((chore) => (
                  <WebDraggableChoreCard
                    key={chore.id}
                    chore={chore}
                    onPress={() => handleChoreDetail(chore)}
                  />
                ))}
              </WebDropZone>
            </div>
          </div>
        </DndProvider>
      </GradientContainer>
    );
  }

  return (
    <GradientContainer>
      {/* UNCOMMENT BELOW FOR NATIVE CONFETTI */}
      {/* 
      {showConfetti && (
        <ConfettiCannon count={120} origin={{x: width/2, y: 0}} fadeOut />
      )}
      */}
      <DraxProvider>
        <Text style={styles.mainScreen_container_Text}>My Chores</Text>
        {/* To Do Tab remains as a separate screen */}
        <View style={{ marginBottom: 16 }}>
          <TodoScreen chores={chores.filter(c => c.status === 'todo')} />
        </View>
        {/* Drag-and-drop To Do <-> Done */}
        <View style={dndStyles.listsContainer}>
          {/* To Do List */}
          <View style={dndStyles.listBox}>
            <Text style={dndStyles.listTitle}>To Do</Text>
            <DraxScrollView
              style={dndStyles.scrollView}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {chores.filter(c => c.status === 'todo').map((chore, idx) => (
                <DraxView
                  key={chore.id}
                  style={dndStyles.draxItem}
                  draggingStyle={dndStyles.dragging}
                  dragReleasedStyle={dndStyles.dragging}
                  hoverDraggingStyle={dndStyles.dragging}
                  dragPayload={chore.id}
                  longPressDelay={150}
                >
                  <ChoresCard
                    status={chore.status}
                    chore={chore.chore}
                    assignedTo={chore.assignedTo}
                    countdown={chore.countdown}
                    reward={chore.reward}
                  />
                </DraxView>
              ))}
            </DraxScrollView>
          </View>
          {/* Done List as Drop Zone */}
          <View style={dndStyles.listBox}>
            <Text style={dndStyles.listTitle}>Done</Text>
            <DraxScrollView
              style={dndStyles.scrollView}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <DraxView
                style={dndStyles.dropZone}
                receivingStyle={dndStyles.receiving}
                onReceiveDragDrop={({ dragged: { payload } }) => {
                  updateChoreStatus(payload, 'done');
                }}
              >
                {doneChores.length === 0 && (
                  <Text style={{ color: '#aaa', textAlign: 'center', marginVertical: 16 }}>Drop here</Text>
                )}
                {doneChores.map((chore) => (
                  <ChoresCard
                    key={chore.id}
                    status={chore.status}
                    chore={chore.chore}
                    assignedTo={chore.assignedTo}
                    countdown={chore.countdown}
                    reward={chore.reward}
                  />
                ))}
              </DraxView>
            </DraxScrollView>
          </View>
        </View>
      </DraxProvider>
    </GradientContainer>
  );
}

const dndStyles = StyleSheet.create({
  listsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    flex: 1,
  },
  listBox: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    padding: 8,
    minHeight: 300,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    flexGrow: 1,
  },
  draxItem: {
    marginBottom: 12,
  },
  dropZone: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#b2dfdb',
    borderRadius: 10,
    padding: 4,
    backgroundColor: '#e0f7fa',
  },
  receiving: {
    borderColor: '#4f8cff',
    backgroundColor: '#b3e5fc',
  },
  dragging: {
    opacity: 0.7,
    borderColor: '#ffcc5c',
    borderWidth: 2,
  },
});
