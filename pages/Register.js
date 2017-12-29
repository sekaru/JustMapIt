import React from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, ScrollView } from 'react-native';
import Button from 'react-native-button';
import * as Config from '../utils/config';
import { addToast } from '../utils/toasts';
import { saveLogin } from '../utils/helpers';
import * as Colours from '../utils/colours';
import { NavigationActions } from 'react-navigation';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: '',
      pass2: '',
      continueText: 'Register'
    }
  }

  render() {
    const { goBack, state } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.centred, styles.header]}>Register for {state.params.lobbyCode}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {/* name */}
          <View style={{marginVertical: 10}}><Text style={styles.centred}>What's your name?</Text></View>
          
          <View style={styles.passInputContainer}>
            <TextInput
              style={styles.passInput}
              onChangeText={(text) => this.setState({name: text})}
              value={this.state.name}
              underlineColorAndroid={'lightgray'}
              autoCorrect={false}
              autoCapitalize={'words'}
            />
          </View>

          {/* pass */}
          <View style={{marginVertical: 10}}><Text style={styles.centred}>Choose a password</Text></View>
          
          <View style={styles.passInputContainer}>
            <TextInput
              style={styles.passInput}
              onChangeText={(text) => this.setState({pass: text})}
              value={this.state.pass}
              underlineColorAndroid={'lightgray'}
              autoCorrect={false}
              secureTextEntry={true}
            />
          </View>

          {/* pass2 */}
          <View style={{marginVertical: 10}}><Text style={styles.centred}>Retype that password</Text></View>
          
          <View style={styles.passInputContainer}>
            <TextInput
              style={styles.passInput}
              onChangeText={(text) => this.setState({pass2: text})}
              value={this.state.pass2}
              underlineColorAndroid={'lightgray'}
              autoCorrect={false}
              secureTextEntry={true}
            />
          </View>
              
          {
            this.state.name.length> 0 && this.state.pass.length>0 && this.state.pass2.length>0 ? 
            <Button
              style={styles.button} 
              onPress={() => this.continuePress()}                  
            >
              {this.state.continueText}
            </Button> : null
          }          

          <Button
            style={styles.button}            
            onPress={() => {goBack(); Keyboard.dismiss()}}              
          >
            Cancel
          </Button>
        </View>
      </View>
    );
  }

  continuePress() {
    const { navigate, state } = this.props.navigation;

    if(this.state.pass!==this.state.pass2) {
      addToast('Those passwords don\'t match!');
      return;
    }

    this.setState({continueText: 'Loading...'});
 
    fetch(Config.serverURL + '/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobby: state.params.lobbyCode,
        name: this.state.name,
        pass: this.state.pass
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        Keyboard.dismiss();     
        saveLogin({user: responseJson.user, lobbyCode: state.params.lobbyCode})

        dispatch(
          NavigationActions.reset(
            {
              index: 0,
              actions: [
              NavigationActions.navigate({
                routeName: 'Map',
                params: {
                  user: responseJson.user
                }
              })
              ]
            })
        );
      } else {
        addToast(responseJson.msg);          
      }
      this.setState({continueText: 'Register'});      
    }); 
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
    backgroundColor: Colours.primary,
    color: 'white',
    borderRadius: 6,
    width: '100%'
  },
  passInputContainer: {
    alignItems: 'center'    
  },
  passInput: {
    height: 42,
    textAlign: 'center', 
    fontWeight: 'bold',
    padding: 8,
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 20
  },
  people: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  person: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
    width: 160,
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colours.primary
  },
  selectedPerson: {
    elevation: 3
  }
});
