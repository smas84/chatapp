import { View, TextInput, StyleSheet} from "react-native";
import { useState } from 'react';
import { AntDesign,MaterialIcons } from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {API,graphqlOperation} from 'aws-amplify';
import {createMessage, updateChatRoom} from '../../graphql/mutations';
import {Auth} from 'aws-amplify' ;

const InputBox4Messaging = ({ chatroom }) => {
  const [newText, setNewText] = useState('');

  const onSend = async() => {
    console.warn("Send a new message: ", newText);
    const authUser = await Auth.currentAuthenticatedUser();
    const newMessage = {
      chatroomID: chatroom.id, 
      text: newText , 
      userID: authUser.attributes.sub,
    };

    const newMessageData = await API.graphql(graphqlOperation(
      createMessage, {input: newMessage}
    ));
    setNewText("");

    // set the new message as LastMessage of the ChatRooms
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatroom._version,
          chatRoomLastMessageId: newMessageData.data.createMessage.id,  
          id: chatroom.id,
        },
      })
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
    {/* '+' icon */}
      <AntDesign name="plus" size={24} color="royalblue" />
    {/* text box */}
      <TextInput 
        value={newText}
        onChangeText={setNewText} 
        style={styles.inputText} 
        placeholder ="Tyoe your message..."
      />
    {/* 'SEND' icon */}
      <MaterialIcons onPress={onSend} style={styles.send} name="send" size={20} color="white" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "whitesmoke",
      padding: 5,
      alignItems: "center",
    },
    inputText: {
      fontSize: 18,
      flex: 1,
      backgroundColor: "white",
      padding: 5,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      borderRadius: 50,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "lightgray",
    },
    send: {
      backgroundColor: "royalblue",
      padding: 9,
      height: 36,
      width: 36, 
      justifyContent:"space-evenly",      
      borderRadius: 18,
      overflow: "hidden",
    },
  });

export default InputBox4Messaging;
