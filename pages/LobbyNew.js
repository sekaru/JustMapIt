import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Button from 'react-native-button';

export default class LobbyNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'Loading...'
    }

    this.fetchCode();
  }

  fetchCode() {
    fetch('http://52.58.65.213:3000/lobby-code')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({code: responseJson.code});
    })
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.centred, styles.header]}>Let's make a new lobby</Text>
          <Text style={styles.centred}>Keep this code handy, you'll need it anytime you want to see the places in your lobby</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.lobbyCodeContainer}>
            <Text
              style={styles.lobbyCode}
            >
              {this.state.code}
            </Text>
          </View>

          <Button
            style={styles.button}            
            onPress={() => {navigate('Map', {lobbyCode: this.state.code})}}              
          >
          Continue
          </Button>

          <Button
            style={styles.button}            
            onPress={() => {navigate('Home')}}              
          >
          Cancel
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
    width: '100%',
  },
  button: {
    marginTop: 10,
    padding: 12,
    backgroundColor: 'orange',
    color: 'white',
    borderRadius: 6,
    width: '100%'
  },
  lobbyCodeContainer: {
    alignItems: 'center'
  },
  lobbyCode: {
    fontSize: 18,
    textAlign: 'center', 
    fontWeight: 'bold',
    padding: 8,
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 20,
  }
});
