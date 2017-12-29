import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Button from 'react-native-button';
import Card from './Card';
import * as Strings from '../utils/strings';
import Icon from 'react-native-vector-icons/EvilIcons';

const { width, height } = Dimensions.get("window");

const cardW = 250;
const cardH = 300;

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      loading: true
    }
  }

  componentWillReceiveProps(props) {
    if(props.places.length==0) {
      this.setState({show: false});
    }
    this.setState({loading: false});
  }

  toCard(place) {
    return (
      <Card 
        key={place.link} 
        {...place} 
        lobbyCode={this.props.lobbyCode} 
        cardW={cardW} 
        cardH={cardH} 
        mode={this.props.mode} 
        getLobbyPlaces={this.props.getLobbyPlaces}
        navigation={this.props.navigation}
        />
    )
  }

  render() {
    const { mode, tapLobbyCode, lobbyCode, places } = this.props;

    return (
      <View style={{alignItems: 'center'}}>
        <View style={{width: width-12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={styles.lobbyCodeContainer}>
            <Button onPress={tapLobbyCode} disabled={mode==0} style={styles.lobbyCode}>Show Lobby</Button>  
          </View>

          <View style={{marginTop: 10}}>
            <ActivityIndicator animating={this.state.loading} size={'large'} color={'orange'}></ActivityIndicator>                                                        
          </View>

          <View style={styles.lobbyCodeContainer}>
            <Button onPress={() => this.openLobbyView()} style={styles.lobbyCode}>{lobbyCode}<Icon name="external-link" size={30} color="#007aff" /></Button>  
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}  
          scrollEnabled={this.state.show && places.length>0}      
        >
          {this.state.show ? places.map((place) => place.archived ? null : this.toCard(place)) : null}
        </ScrollView>

        <View style={styles.toggleButtonContainer}>
          {
            !this.state.loading && places.length>0 && 
            <Button onPress={() => this.toggleCards()} 
                    style={styles.toggleButton}
            >
              {this.state.show ? Strings.hidePlaces : Strings.showPlaces}
            </Button>   
          }  
        </View>
      </View>    
    )
  }

  toggleCards() {
    this.setState({show: !this.state.show});      
  }

  openLobbyView() {
    const { navigate, state } = this.props.navigation;
    navigate('LobbyView', {source: 'http://justpick.it/?lobby=' + state.params.lobbyCode});
  }
}

const styles = StyleSheet.create({
  lobbyCodeContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'center'
  },
  lobbyCode: {
    fontWeight: 'bold',   
  },
  loadingBg: {
    padding: 5, 
    borderRadius: 30
  },
  scrollViewContainer: {
    paddingRight: 10,
    alignItems: 'center',
  },
  scrollView: {
    width: width,
    height: cardH,
  },
  toggleButtonContainer: {
    flex: 1,
    justifyContent: 'center',  
  },
  toggleButton: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10
  }
});