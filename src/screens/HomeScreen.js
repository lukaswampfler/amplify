import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, Pressable , SafeAreaView, TouchableOpacity, Button} from 'react-native'
import Loading from './Loading'
import { listMessages} from '../graphql/queries';
import  { API, Auth, graphqlOperation}from 'aws-amplify'

import styles from './styles'

import {onCreateMessageByReceiverID} from '../graphql/subscriptions'

import AppContext from '../components/AppContext';




const MessageItem = ({ message }) => (
  <View style={styles.item}>
    <TouchableOpacity onPress = {() => {console.log("Button pressed.")} }>
    <Text style={styles.title}>{message.text} from {message.sender.name}</Text>
  </TouchableOpacity>
  </View>
);





export default function HomeScreen ({navigation})  {


  

  const myContext = useContext(AppContext);

  const [latestMessage, updateLatestMessage] = useState("No message yet...");

  async function signOut() {
    try {
        await Auth.signOut();
        myContext.setUserLoggedIn('loggedOut');
        console.log("sign out succesful")
    } catch (error) {
        console.log('error signing out: ', error);
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
       updateLatestMessage(messageData.value.data.onCreateMessageByReceiverID.text)
       console.log("messageData: ", messageData)
     }
   })
 }
  

  const renderItem = ({ item }) => (
    <MessageItem message={item} />
  );


const [messages, setMessages] = useState(null);

const getMessages = async () => {
  const messages = await API.graphql({query:listMessages, variables: {limit: 100}});
  setMessages(messages);
}

useEffect(() => {
  subscribe();
}, [])

useEffect(() => 
{
  alert("Signed in as "+ myContext.userName);
  console.log("username: ", myContext.userName);
}, [])

 useEffect(() => {
    getMessages();
  }
  , [latestMessage])

//console.log("messages: ", messages);


 
 return (
  <SafeAreaView style={styles.container}>
 <Button onPress = {signOut} title="Sign Out"/>

  {messages        ?  
      <FlatList
        data = {messages.data.listMessages.items}
        renderItem={renderItem}
        keyExtractor={item => item.createdAt}
      /> : <Loading/> }

    </SafeAreaView> 


  
  )

 

}

