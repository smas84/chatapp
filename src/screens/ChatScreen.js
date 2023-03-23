import { ImageBackground, StyleSheet, FlatList } from "react-native";
import bg from "../../assets/images/BG.png";
import MessageThread from "../components/MessageThread";
import messages from "../../assets/data/messages.json";
import InputBox4Messaging from "../components/InputBox4Messaging";

const ChatScreen = () => {
  return (
    <ImageBackground source={bg} style={styles.bg}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageThread message={item} />}
		    style={{ padding: 10 }}
		    inverted
      />
      <InputBox4Messaging />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    bg: {
      flex: 1,
    },
  });
  
  export default ChatScreen;