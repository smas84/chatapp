import { FlatList } from "react-native";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listChatRooms } from "./queries";
import { useEffect, useState }  from "react" ;

const ChatListScreen = () => {
  const [chatRoom, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetching list of Chatrooms
  const fetchChatRooms = async () => {
    setLoading(true) ;
    const authUser = await Auth.currentAuthenticatedUser();
    const response = await API.graphql(
      graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    );
    
    const rooms = response.data.getUser.ChatRooms.items;
    console.log(response)
    const sortedRooms = rooms.sort(
      (r1, r2) => new Date(r1.chatRoom.updatedAt) - new Date(r2.chatRoom.updatedAt)
    );
    
    setChatRooms(sortedRooms);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <FlatList
      data={chatRoom}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      style={{backgroundColor: "white" }}
      refreshing = {loading}
      onRefresh = {fetchChatRooms}
    />
  );
};

export default ChatListScreen;