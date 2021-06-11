import React, {useState, useEffect} from 'react'
import { View, Text, FlatList, Pressable , SafeAreaView, TouchableOpacity} from 'react-native'
import Loading from './Loading'
import { listMessages} from '../graphql/queries';
import  { API, graphqlOperation}from 'aws-amplify'

import styles from './styles'






const MessageItem = ({ message }) => (
  <View style={styles.item}>
    <TouchableOpacity onPress = {() => {console.log("Button pressed.")} }>
    <Text style={styles.title}>{message.text} from {message.sender.name}</Text>
  </TouchableOpacity>
  </View>
);

export default function HomeScreen ()  {


  

  const renderItem = ({ item }) => (
    <MessageItem message={item} />
  );


const [messages, setMessages] = useState(null);

const getMessages = async () => {
  const messages = await API.graphql({query:listMessages, variables: {limit: 100}});
  setMessages(messages);
}

 useEffect(() => {
    getMessages();
  }
  , [])

console.log("messages: ", messages);


 
 return (
  <SafeAreaView style={styles.container}>
  {messages        ?  
      <FlatList
        data = {messages.data.listMessages.items}
        renderItem={renderItem}
        keyExtractor={item => item.createdAt}
      /> : <Loading/> }

    </SafeAreaView> 


  
  )

 

}

