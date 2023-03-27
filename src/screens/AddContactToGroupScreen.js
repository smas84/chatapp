import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { createChatRoom,createUserChatRoom } from "../graphql/mutations";
import { useRoute, useNavigation } from "@react-navigation/native";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [name, setName] = useState("");

  const navigation = useNavigation();
  const route = useRoute();
  const chatRoom = route.params.chatRoom;

  // only show those contacts that are NOT already in the Chatroom (Group) and those that they might have deleted
  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items.filter((item) => !chatRoom.users.items.some(
        (existingUser) => item.id == existingUser.userId && !existingUser._deleted
      )));
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Add" disabled={selectedUserIds.length<1} onPress={onAddToChatroomPress} />
      ),
    });
  }, [name,selectedUserIds]);

  const onAddToChatroomPress = async() => {

    // Add the selected user to the GroupChatRoom
    await Promise.all(
        selectedUserIds.map((userId) =>  
            API.graphql(
                graphqlOperation(createUserChatRoom, {
                    input: { chatRoomId: chatRoom.id, userId },
                })
            )
        )
    );

    setSelectedUserIds([]);
    // Navigate to the newly created ChatRoom
    navigation.goBack();
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