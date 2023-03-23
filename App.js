import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ChatListScreen from './src/screens/ChatListScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <ChatListScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingVertical: 70,
  },
});
