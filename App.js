import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View , Button} from 'react-native';
import Amplify , {Auth, API} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import config from './src/aws-exports';
import {onCreateMessageByReceiverID} from './src/graphql/subscriptions'


Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

function App() {

  const [message, updateMessage] = useState("No message yet...");

  useEffect(()=> {
    subscribe()
  }
  ,[] )

async function signOut(){
  try{
    await Auth.signOut();
  } catch (error){
    console.log("error signing out ", error);
  }
}

  function subscribe(){
     API.graphql({
      query: onCreateMessageByReceiverID,
      variables: {
        receiverID: "ed5cba0b-475a-4424-9a54-9e7018b357fa"
      },
    }).subscribe({
      error: err => console.log("error caught", err),
      next: messageData =>{
        alert("Received new message from " +messageData.value.data.onCreateMessageByReceiverID.sender.name )
        updateMessage(messageData.value.data.onCreateMessageByReceiverID.text)
        console.log("messageData: ", messageData)
      }
    })
  }

  return (
    <View style={styles.container}>
     <Text> {message} </Text>
     <Button title = "Sign out" onPress ={signOut}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App);