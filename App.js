import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import Open from './Screens/open'
import Contacts from './Screens/Contacts'

export default class App extends React.Component {
  render(){
  return  <AppContainer/>
  }
 }

 const Appnav = createSwitchNavigator ({
   Open: {screen : Open},
   Contact : {screen : Contacts},
 })

const AppContainer = createAppContainer(Appnav)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
