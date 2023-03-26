import { ImageBackground, StyleSheet, FlatList ,KeyboardAvoidingView, ActivityIndicator} from "react-native";
import bg from "../../assets/images/BG.png";
import MessageThread from "../components/MessageThread";
import messages from "../../assets/data/messages.json";
import InputBox4Messaging from "../components/InputBox4Messaging";
import {useRoute, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from "react" ;
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries';

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const chatroom_id = route.params.id ; 
  
  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params]);

  // fetch chatroom
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroom_id })).then(
      (result) => setChatRoom(result.data?.getChatRoom)
    );
  }, [chatroom_id]);

  // fetching the messages 
  useEffect(() => {
    API.graphql(graphqlOperation(listMessagesByChatRoom, {
      chatroomID: chatroom_id,
      sortDirection: "DESC",
      })
    ).then((result) => {
      console.log(result)
      setMessages(result.data?.listMessagesByChatRoom?.items)
      }
    );
  }, [chatroom_id]);

  if (!chatRoom){
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90} style={styles.bg}>
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <MessageThread message={item} />}
          style={{ padding: 10}}
          inverted
        />
        <InputBox4Messaging chatroom={chatRoom}/>
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