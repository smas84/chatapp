import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { createChatRoom,createUserChatRoom } from "../graphql/mutations";
import { useNavigation } from "@react-navigation/native";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [name, setName] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Create" disabled={!name || selectedUserIds.length<1} onPress={onCreateGroupPress} />
      ),
    });
  }, [name,selectedUserIds]);

  const onCreateGroupPress = async() => {

    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, {input: {}})
    );

    if (!newChatRoomData.data?.createChatRoom){
      console.log("Error creating the chatroom")
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;
    
    // Add the selected user to the GroupChatRoom
    await Promise.all(
        selectedUserIds.map((userId) =>  
            API.graphql(
                graphqlOperation(createUserChatRoom, {
                    input: { chatRoomId: newChatRoom.id, userId },
                })
            )
        )
    );

    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: {chatRoomId: newChatRoom.id, userId: authUser.attributes.sub},
      })
    );

    setSelectedUserIds([]);
    setName(""); 
    // Navigate to the newly created ChatRoom
    navigation.navigate( "Chat Content" , { id: newChatRoom.id } );
  };

  const onContactPress = (id) => {
    setSelectedUserIds((userIds) =>
      userIds.includes(id)
        ? selectedUserIds.filter((uid) => uid !== id)
        : [...userIds, id]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem 
            user={item} 
            selectableIcon 
            isSelected={selectedUserIds.includes(item.id)}
            onPress={() => onContactPress(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
});

export default ContactsScreen;