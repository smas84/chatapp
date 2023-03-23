import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const InputBox4Messaging = () => {
  return (
    <View style={styles.container}>
    {/* '+' icon */}
      <AntDesign name="plus" size={24} color="royalblue" />
    {/* text box */}
      <TextInput style={styles.inputText} />
    {/* 'SEND' icon */}
      <MaterialIcons style={styles.send} name="send" size={20} color="white" />
    </View>
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
