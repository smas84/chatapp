import { View, Text, Image, StyleSheet, Pressable} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react' ;
import {Auth, API, graphqlOperation} from 'aws-amplify' ;
import {onUpdateChatRoom} from '../../graphql/subscriptions' ;

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
  const navigation = useNavigation();
  // we loop through chat.users.items and find a user that is not the Authenticated user [self]
  const [user, setUser] = useState(null);
  const [chatRoom, setChatRoom] = useState(chat);

  useEffect(() => {
    const fetchUser = async() => {
      const authUser = await Auth.currentAuthenticatedUser();
      const userItem = chatRoom.users.items.find(item => item.user.id != authUser.attributes.sub); 
      setUser(userItem?.user)
    };
    fetchUser(); 
  },[]);
  
  useEffect(() => {
    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chat.id } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });
  
    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chat.id]);

  return (
    <Pressable
      onPress={() => navigation.navigate("Chat Content", {id: chatRoom.id, name: user?.name})}
      style={styles.container}
    >
			{/* User Avatar */}
      <Image source={{uri: user?.image}} style={styles.image}/>
			{/* Content Container */}
      <View style={styles.content}>
				{/* Row */}
				<View style={styles.row}>
	        <Text numberOfLines={1} style={styles.name}>{user?.name}</Text>
          {chatRoom.LastMessage && (
		       <Text style={styles.subTitle}>{dayjs(chatRoom.LastMessage?.createdAt).fromNow(true)}</Text>
          )}
	      </View>
        {/* Message body */}
        <Text numberOfLines={2} style={styles.subTitle}>{chatRoom.LastMessage?.text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomColor: "lightgray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});

export default ChatListItem;