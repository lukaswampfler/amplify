import React, {useState, useContext} from 'react';
import { View, Text, StyleSheet, Button, FlatList, Pressable } from 'react-native';
import { Auth } from 'aws-amplify';
import AppContext from '../components/AppContext';

//import { gql, useQuery } from '@apollo/client'

/*const MESSAGES_QUERY = gql`
  query listMessages{
  messagesByReceiver(
    receiverID:"ed5cba0b-475a-4424-9a54-9e7018b357fa", limit:5)
  {
    items{
      text
      sender{
        name
      }
    }
  }
}
`*/


export default function Home({ updateAuthState }) {
     

  const myContext = useContext(AppContext);
  console.log(myContext.userName, myContext.dummyUser)


  alert("Hello, "+ myContext.userName);
  alert("Hello dummy:  "+ myContext.dummyUser);
  //const { data, loading } = useQuery(MESSAGES_QUERY)

  //console.log(data);

    async function signOut() {
    try {
      await Auth.signOut();
      updateAuthState('loggedOut');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }
  return (
    <View style={styles.container}>
      <Text> Hello, {myContext.userName} </Text>
      <Button title="Sign Out" color="tomato" onPress={signOut} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  }
});