import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage } from 'react-native';
import Button from 'react-native-button';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkCurrLobby();    
  }

  async checkCurrLobby() {
    try {
      const value = await AsyncStorage.getItem('currLobby');
      if (value !== null) {
        const { navigate } = this.props.navigation;
        navigate('Map', {lobbyCode: value});           
      }
    } catch (error) {
      console.warn(error)
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
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
      </View>
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
    backgroundColor: 'orange',
    color: 'white',
    borderRadius: 6,
    width: '100%'
  }
});
