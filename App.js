import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, AsyncStorage } from 'react-native';
import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import LoadingScreen from './pages/Loading';
import HomeScreen from './pages/Home';
import MapScreen from './pages/Map';
import ExistingScreen from './pages/LobbyExisting';
import NewScreen from './pages/LobbyNew';
import LobbyViewScreen from './pages/LobbyView';
import WhoScreen from './pages/Who';
import RegisterScreen from './pages/Register';
import * as Config from './utils/config';

const ScreenNavigator = StackNavigator({
  Loading: { screen: LoadingScreen },
  Home: { screen: HomeScreen },
  ExistingLobby: { screen: ExistingScreen },
  NewLobby: { screen: NewScreen },
  Map: { screen: MapScreen },
  LobbyView: { screen: LobbyViewScreen },
  Who: { screen: WhoScreen },
  Register: { screen: RegisterScreen }
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
        "origin": ""
      }
    })
    .then((response) => response.text())
    .then((responseText) => {
      fetch(responseText + '/server?id=jpi')
      .then((response) => response.text())
      .then((responseText) => {
        Config.serverURL = 'http://' + responseText;
        this.checkSavedLogin();
        this.setState({loading: false});         
      });
    });
  }

  async checkSavedLogin() {
    try {
      const value = await AsyncStorage.getItem('savedLogin');
      if (value !== null) {
        let parsedVal = JSON.parse(value);

        this.refs.nav.dispatch(
          NavigationActions.navigate({
            routeName: 'Map',
            params: {
              user: parsedVal.user,
              cookie: true
            }
          })
        );
      } else {
        this.refs.nav.dispatch(
          NavigationActions.navigate({
            routeName: 'Home'
          })
        );
      }
    } catch (error) {
      console.warn(error)
    }
  }

  render() {
    return (
      !this.state.loading ? 
      <ScreenNavigator ref='nav' onNavigationStateChange={this.navChange.bind(this)} />
      :
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 28, marginBottom: 5}}>Just Map It</Text>
        <ActivityIndicator color={'orange'} animating={true} size={'large'}></ActivityIndicator>
      </View>
    );
  }

  navChange(prevState, newState, action) {
    if(newState.routes[newState.index].routeName==='Loading') {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Home'})
        ]
      });

      this.refs.nav.dispatch(resetAction);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})