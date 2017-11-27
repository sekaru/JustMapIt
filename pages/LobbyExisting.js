import React from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
import Button from 'react-native-button';

export default class LobbyExisting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      continueText: 'Continue'
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.centred, styles.header]}>Let's get mapping</Text>
          <Text style={styles.centred}>Enter your 5-digit lobby code below</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.lobbyInputContainer}>
            <TextInput
              style={styles.lobbyInput}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              maxLength={5}
              underlineColorAndroid={'lightgray'}
              autoCapitalize={'characters'}
            />
          </View>

          <Button
            style={styles.button}            
            onPress={() => {navigate('Home'); Keyboard.dismiss()}}              
          >
            Cancel
          </Button>

          {
            this.state.text.length===5 && 
            <Button
              style={styles.button}            
              onPress={this.continuePress.bind(this)}              
            >
            {this.state.continueText}
            </Button>
          }
        </View>
      </View>
    );
  }

  continuePress() {
    const { navigate } = this.props.navigation;

    this.setState({continueText: 'Loading...'});

    fetch('http://52.58.65.213:3000/lobby?id=' + this.state.text)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        navigate('Map');   
        Keyboard.dismiss();     
        this.setState({continueText: 'Continue'});
      } 
    })    
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
  lobbyInputContainer: {
    alignItems: 'center'    
  },
  lobbyInput: {
    height: 42,
    textAlign: 'center', 
    fontWeight: 'bold',
    padding: 8,
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 16
  }
});
