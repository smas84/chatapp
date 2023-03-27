import { FlatList } from "react-native";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listChatRooms } from "./queries";
import { useEffect, useState }  from "react" ;

const ChatListScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetching list of Chatrooms using "listChatRooms" Query
  const fetchChatRooms = async () => {
    setLoading(true) ;
    const authUser = await Auth.currentAuthenticatedUser();
    const response = await API.graphql(
      graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    );

    console.log(response.data.getUser.ChatRooms.items)    
    const rooms = response.data.getUser.ChatRooms.items.filter((item) => !item._deleted);
    const sortedRooms = rooms.sort(
      (r1, r2) => new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt)
    );
    
    setChatRooms(sortedRooms);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <FlatList
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      style={{backgroundColor: "white" }}
      refreshing = {loading}
      onRefresh = {fetchChatRooms}
    />
  );
};

export default ChatListScreen;