import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, AsyncStorage } from 'react-native';
import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import LoadingScreen from './pages/Loading';
import HomeScreen from './pages/Home';
import MapScreen from './pages/Map';
import ExistingScreen from './pages/LobbyExisting';
import NewScreen from './pages/LobbyNew';
import * as Config from './utils/config';

const ScreenNavigator = StackNavigator({
  Loading: { screen: LoadingScreen },
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
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    fetch('https://cors-anywhere.herokuapp.com/http://sleepystudios.net/waker.txt', {
      headers: {
        "origin": "''"
      }
    })
    .then((response) => response.text())
    .then((responseText) => {
      fetch(responseText + '/server?id=jpi')
      .then((response) => response.text())
      .then((responseText) => {
        Config.serverURL = 'http://' + responseText;
        this.checkCurrLobby();
        this.setState({loading: false});         
      });
    });
  }

  async checkCurrLobby() {
    try {
      const value = await AsyncStorage.getItem('currLobby');
      if (value !== null) {
        this.refs.nav.dispatch(
          NavigationActions.navigate({
            routeName: 'Map',
            params: {
              lobbyCode: value
            }
          })
        )
      } else {
        this.refs.nav.dispatch(
          NavigationActions.navigate({
            routeName: 'Home'
          })
        )
      }
    } catch (error) {
      console.warn(error)
    }
  }

  render() {
    return (
      !this.state.loading ? 
      <ScreenNavigator ref='nav' />
      :
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 28, marginBottom: 5}}>Just Map It</Text>
        <ActivityIndicator color={'orange'} animating={true} size={'large'}></ActivityIndicator>
      </View>
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