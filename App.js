import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Amplify , {Auth, API} from 'aws-amplify';
import config from './src/aws-exports';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import AWSAppSyncClient from 'aws-appsync'
import {ApolloProvider} from 'react-apollo'
//import { Rehydrated } from 'aws-appsync-react'
import AppContext from './src/components/AppContext'; 
import {ApolloClient} from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'


import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import ConfirmSignUp from './src/screens/ConfirmSignUp';
import Home from './src/screens/Home';
import HomeScreen from './src/screens/HomeScreen';


Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});




/*const client = new AWSAppSyncClient({
  url: config.graphqlEndpoint,
  region: config.region,
  auth: {
    type: config.authenticationType,
    apiKey: config.apiKey,
    jwtToken: async () => {Auth.currentSession().then(session => session.getIdToken().getJwtToken())}, // Required when you use Cognito UserPools OR OpenID Connect.
  }
})*/


const AuthenticationStack = createStackNavigator();
const AppStack = createStackNavigator();
const AuthenticationNavigator = props => {
  return (
    <AuthenticationStack.Navigator headerMode="none">
      <AuthenticationStack.Screen name="SignIn">
        {screenProps => (
          <SignIn {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AuthenticationStack.Screen>
      <AuthenticationStack.Screen name="SignUp" component={SignUp} />
      <AuthenticationStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
      />
    </AuthenticationStack.Navigator>
  );
};
const AppNavigator = props => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home Screen">
        {screenProps => (
          <HomeScreen {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};

const Initializing = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
};




function App() {

  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');

  

  const [userName, setUserName] = useState('');
  
  const [dummyUser, setDummyUser] = useState('Dummy');



  



  useEffect(() => {
    let token =  Auth.currentSession().then(session => session.getIdToken().getJwtToken())
    console.log(token);
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
      console.log('User is signed in');
      setUserLoggedIn('loggedIn');
    } catch (err) {
      console.log('User is not signed in');
      setUserLoggedIn('loggedOut');
    }
  }

  const userSettings = {
    userName,
    dummyUser,
    setUserName, 
    setDummyUser
  }

  function updateAuthState(isUserLoggedIn) {
    setUserLoggedIn(isUserLoggedIn);
  }


  //<ApolloProvider client={client}></ApolloProvider>
  return (
    <AppContext.Provider value = {userSettings}>
    <NavigationContainer>
      {isUserLoggedIn === 'initializing' && <Initializing />}
      {isUserLoggedIn === 'loggedIn' && (
        <AppNavigator updateAuthState={updateAuthState} />
      )}
      {isUserLoggedIn === 'loggedOut' && (
        <AuthenticationNavigator updateAuthState={updateAuthState} />
      )}
    </NavigationContainer>
    </AppContext.Provider>
  );

  /*

  return (
    <View style={styles.container}>
     <Text> {message} </Text>
      <StatusBar style="auto" />
    </View>
  );*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;