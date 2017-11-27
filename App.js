import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './pages/Home';
import MapScreen from './pages/Map';
import ExistingScreen from './pages/LobbyExisting';
import NewScreen from './pages/LobbyNew';

const ScreenNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  ExistingLobby: { screen: ExistingScreen },
  NewLobby: { screen: NewScreen },
  Map: { screen: MapScreen },
}, {
  // tabBarPosition: 'bottom',
  // tabBarOptions: {
  //   inactiveTintColor: 'yellow',       
  //   style: {
  //     backgroundColor: 'orange',
  //   },
  //   indicatorStyle: {
  //     backgroundColor: 'white'
  //   }
  // },
  headerMode: 'none'
});

export default class App extends React.Component {
  render() {
    return (
      <ScreenNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})