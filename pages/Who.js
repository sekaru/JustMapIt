import React from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, ScrollView } from 'react-native';
import Button from 'react-native-button';
import * as Config from '../utils/config';
import { addToast } from '../utils/toasts';
import { saveLogin } from '../utils/helpers';
import * as Colours from '../utils/colours';
import { NavigationActions } from 'react-navigation'

export default class LobbyExisting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      people: [],
      selectedPerson: null,
      continueText: 'Continue'
    }
  }

  componentWillMount() {
    this.getPeople();
  }

  getPeople() {
    const { state } = this.props.navigation;
    
    fetch(Config.serverURL + '/get-users?id=' + state.params.lobbyCode)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({people: responseJson});
    });
  }

  render() {
    const { navigate, state } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.centred, styles.header]}>Who are you?</Text>
          {this.state.people && this.state.people==0 ? <Text>Be the first to register!</Text>: null}
        </View>

        <Button onPress={() => navigate('Register', {lobbyCode: state.params.lobbyCode})} style={styles.person}>Register</Button>                
        <View style={{height: 140}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.people.map(this.toPersonButton)}
          </ScrollView>
        </View>

        <View style={styles.buttonsContainer}>
          {
            this.state.selectedPerson ?
            <View>
              <View style={{marginBottom: 10}}><Text style={styles.centred}>Hey {this.state.selectedPerson.name}. Enter your password:</Text></View>
              
              <View style={styles.passInputContainer}>
                <TextInput
                  style={styles.passInput}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  underlineColorAndroid={'lightgray'}
                  autoCorrect={false}
                  secureTextEntry={true}
                />
              </View>
            </View> : null
          }
              
          {
            this.state.text ? 
            <Button
              style={styles.button} 
              onPress={() => this.continuePress()}                  
            >
              {this.state.continueText}
            </Button> : null
          }          

          <Button
            style={styles.button}            
            onPress={() => {navigate('Home'); Keyboard.dismiss()}}              
          >
            Cancel
          </Button>
        </View>
      </View>
    );
  }

  toPersonButton = (person) => {
    return (
      <Button key={person} 
              style={[styles.person, {backgroundColor: person.colour}, this.state.selectedPerson===person ? styles.selectedPerson : null]} 
              onPress={() => this.setState({selectedPerson: person})}
      >
        {person.name}
      </Button>                        
    )
  }

  continuePress() {
    const { navigate, state, dispatch } = this.props.navigation;

    this.setState({continueText: 'Loading...'});
 
    fetch(Config.serverURL + '/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobby: state.params.lobbyCode,
        name: this.state.selectedPerson.name,
        pass: this.state.text
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        Keyboard.dismiss();     
        saveLogin({user: this.state.selectedPerson, lobbyCode: state.params.lobbyCode})
  
        dispatch(
          NavigationActions.reset(
            {
              index: 0,
              actions: [
              NavigationActions.navigate({
                routeName: 'Map',
                params: {
                  user: this.state.selectedPerson
                }
              })
              ]
            })
        );
      } else {
        addToast(responseJson.msg);          
      }
      this.setState({continueText: 'Continue'});      
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
