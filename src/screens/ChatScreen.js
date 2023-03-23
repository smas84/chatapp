import { ImageBackground, StyleSheet, FlatList ,KeyboardAvoidingView} from "react-native";
import bg from "../../assets/images/BG.png";
import MessageThread from "../components/MessageThread";
import messages from "../../assets/data/messages.json";
import InputBox4Messaging from "../components/InputBox4Messaging";
import {useRoute, useNavigation} from '@react-navigation/native';
import {useEffect} from "react" ;
const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params]);
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90} style={styles.bg}>
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <MessageThread message={item} />}
          style={{ padding: 10}}
          inverted
        />
        <InputBox4Messaging />
      </ImageBackground>
    </KeyboardAvoidingView>    
  );
};

const styles = StyleSheet.create({
    bg: {
      flex: 1,
    },
  });
  
  export default ChatScreen;