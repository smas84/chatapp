import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './src/navigation';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { withAuthenticator } from "aws-amplify-react-native";
import { useEffect } from "react";
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";

Amplify.configure({...awsconfig, Analytics: {disabled: true}})

function App() {

  useEffect(() => {
    const syncUser = async () => {
      // get Auth user
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      // query the database using Auth SubID
      const userData = await API.graphql(
        graphqlOperation(getUser, {id: authUser.attributes.sub})
      )
      // if the user exists in the db do nothing
      if (userData.data.getUser) {
        return;
      }
      // otherwise create the user in the database
      const newUser = {
        id: authUser.attributes.sub,
        name: authUser.attributes.phone_number,
        image: '',
        status: 'Hey, I am using WhatsApp',
      };
      const newUserResponse = await API.graphql(
        graphqlOperation(createUser, {input: newUser})
      );
    };
    syncUser();
  }, [])

  return (
    <View style={styles.container}>
      <Navigator />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App);

