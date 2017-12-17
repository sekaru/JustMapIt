import React from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, AsyncStorage, ScrollView } from 'react-native';
import Button from 'react-native-button';
import * as Config from '../utils/config';
import { addToast } from '../utils/toasts';
import { saveCurrLobby } from '../utils/helpers';

export default class LobbyExisting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      continueText: 'Continue',
      prevLobbies: []
    }
  }

  componentDidMount() {
    this.getPrevLobbies();    
  }

  async getPrevLobbies() {
    try {
      const value = await AsyncStorage.getItem('prevLobbies');
      if(value!==null) {
        this.setState({prevLobbies: JSON.parse(value).lobbies})
      }
    } catch(error) {
      console.warn(error);
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.centred, styles.header]}>Let's get mapping</Text>
          <Text style={styles.centred}>Enter your 5-digit lobby code below</Text>
          <Text> </Text>
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
              autoCorrect={false}
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

          {
            this.state.prevLobbies.length>0 &&
            <View style={styles.prevLobbies}>
              <Text style={styles.prevLobbiesHeader}>Previous Lobbies</Text>          
              <View style={{height: 140}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {this.state.prevLobbies.map(this.toPrevLobbyButton)}
                </ScrollView>
              </View>
            </View>
          }
          
        </View>
      </View>
    );
  }

  toPrevLobbyButton = (prevLobby) => {
    return (
      <Button key={prevLobby} 
              style={styles.prevLobby} 
              onPress={() => {this.setState({text: prevLobby}, this.continuePress)}}>
        {prevLobby}
      </Button>                        
    )
  }

  continuePress() {
    const { navigate } = this.props.navigation;

    this.setState({continueText: 'Loading...'});

    fetch(Config.serverURL + '/lobby?id=' + this.state.text)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        navigate('Map', {lobbyCode: responseJson.code});   

        saveCurrLobby(responseJson.code);        
      } else {
        addToast(responseJson.msg);
      }

      Keyboard.dismiss();     
      this.setState({continueText: 'Continue'});
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
    borderRadius: 20
  },
  prevLobbies: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  prevLobbiesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  prevLobby: {
    fontSize: 16,
    marginVertical: 5,
    backgroundColor: 'orange',
    color: 'white',
    width: 160,
    padding: 8,
    borderRadius: 4
  }
});
