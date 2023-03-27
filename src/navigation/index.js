import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import ChatListScreen from "../screens/ChatListScreen/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import NewGroupScreen from "../screens/NewGroupScreen";
import ContactsScreen from "../screens/ContactsScreen";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle: { backgroundColor: "whitesmoke" }}}>
        <Stack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }}/>      
        <Stack.Screen name="My Chats" component={ChatListScreen} />
        <Stack.Screen name="Chat Content" component={ChatScreen} />
        <Stack.Screen name="New Group" component={NewGroupScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;