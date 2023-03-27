import { useEffect, useState } from "react";
import { FlatList, Pressable, Text } from 'react-native';
import { AntDesign,MaterialIcons } from "@expo/vector-icons";
import ContactListItem from '../components/ContactListItem';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import { listUsers } from "../graphql/queries";
import {createChatRoom, createUserChatRoom} from '../graphql/mutations';
import {getCommonChatRoomWithUser} from '../services/chatRoomService'
const ContactsScreen = () => {
  const navigation = useNavigation();
	const [users, setUsers] = useState([]);
	
	useEffect(() => {
	  API.graphql(graphqlOperation(listUsers)).then((res) => {
	    setUsers(res?.data?.listUsers?.items);
	  });
  }, []);
  
  const createAChatRoomWithTheUser = async(user) => {
    // check if we already have a ChatRoom with user
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      navigation.navigate( "Chat Content" , { id: existingChatRoom.chatRoom.id } );
      return ;
    } 
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, {input: {}})
    );
    // console.log(newChatRoomData);
    if (!newChatRoomData.data?.createChatRoom){
      // console.log("Error creating the chatroom")
    }
      // Create a new chatroom  
    const newChatRoom = newChatRoomData.data?.createChatRoom;
    // Add the clicked user to the ChatRoom
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: user.id },
      })
    );
    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: {chatRoomId: newChatRoom.id, userId: authUser.attributes.sub},
      })
    );
    // Navigate to the newly created ChatRoom
    navigation.navigate( "Chat Content" , { id: newChatRoom.id } );
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <ContactListItem 
          user={item} 
          onPress={() => createAChatRoomWithTheUser(item)} 
        />
      )}
      style={{ backgroundColor: 'white' }}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => {navigation.navigate("New Group")}}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};

export default ContactsScreen;