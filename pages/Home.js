import React from 'react';
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native';
import Button from 'react-native-button';
import * as Colours from '../utils/colours';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bg: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.bg, {toValue: 1, duration: 300}
    ).start();
  }

  render() {
    const { navigate } = this.props.navigation;

    let opacity = this.state.bg.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <Animated.View style={[styles.container, {opacity: opacity}]}>
        <View>
          <Text style={[styles.centred, styles.header]}>Welcome to Just Map It!</Text>
          <Text style={styles.centred}>To get started, select an existing Just Pick It lobby or create a new one</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            style={styles.button}
            onPress={() => {navigate('NewLobby')}}              
          >
          Create Lobby
          </Button>

          <Button
            style={styles.button}            
            onPress={() => {navigate('ExistingLobby')}}              
          >
          Existing Lobby
          </Button>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  centred: {
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  buttonsContainer: {
    marginTop: 10,
    width: '100%'
  },
  button: {
    marginTop: 10,
    padding: 12,
    backgroundColor: Colours.primary,
    color: 'white',
    borderRadius: 6,
    width: '100%'
  }
});
