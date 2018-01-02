import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, AsyncStorage, Animated } from 'react-native';
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
import * as Colours from './utils/colours';

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
      loading: true,
      bg: new Animated.Value(0)
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
        Config.serverURL = responseText;

        Animated.timing(
          this.state.bg, {toValue: 350, duration: 2000}
        ).start();

        setTimeout(() => {
          this.checkSavedLogin();
          this.setState({loading: false});  
        }, 2000);       
      });
    });
  }

  async checkSavedLogin() {
    try {
      const value = await AsyncStorage.getItem('savedLogin');
      if (value !== null) {
        let parsedVal = JSON.parse(value);

        this.refs.nav.dispatch(
          NavigationActions.reset(
            {
              index: 0,
              actions: [
              NavigationActions.navigate({
                routeName: 'Map',
                params: {
                  user: parsedVal.user,
                  cookie: true
                }
              })
              ]
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
    let color = this.state.bg.interpolate({
        inputRange: [0, 50, 100, 150, 200, 250, 300, 350],
        outputRange: [Colours.primary, 'hsl(0, 80%, 60%)', 'hsl(330, 80%, 60%)', 'hsl(300, 80%, 60%)', 'hsl(330, 80%, 60%)', 'hsl(0, 80%, 60%)', Colours.primary, 'rgba(255,255,255,0)']
    });
    
    return (
      !this.state.loading ? 
      <ScreenNavigator ref='nav' />
      :
      <Animated.View style={[styles.container, {backgroundColor: color}]}>
        <Text style={{fontSize: 28, marginBottom: 5, color: 'white'}}>Just Map It</Text>
        <ActivityIndicator color={'white'} animating={true} size={'large'}></ActivityIndicator>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colours.primary
  }
})