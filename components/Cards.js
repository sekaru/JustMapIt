import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Button from 'react-native-button';
import Card from './Card';
import * as Strings from '../utils/strings';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import * as Colours from '../utils/colours';
import { NavigationActions } from 'react-navigation';

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
        name={this.props.name}
        />
    )
  }

  render() {
    const { mode, tapLobbyCode, lobbyCode, places } = this.props;

    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.topBar}>
          <View style={styles.lobbyCodeContainer}>
            <Button onPress={tapLobbyCode} disabled={mode==0} style={styles.lobbyCode}>Show Lobby</Button>  
          </View>

          <View style={[styles.lobbyCodeContainer, styles.loadingBg]}>
            <Button onPress={() => this.logout()}>
              <SimpleLineIcon name="logout" size={18} color={Colours.button} />              
            </Button>
          </View>

          <View style={styles.lobbyCodeContainer}>
            <Button onPress={() => this.openLobbyView()} style={styles.lobbyCode}>{lobbyCode}<EvilIcon name="external-link" size={30} color={Colours.button} /></Button>  
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <ActivityIndicator animating={this.state.loading} size={'large'} color={Colours.primary}></ActivityIndicator>                                                        
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
            !this.state.loading && places.length>0 ? 
            <Button onPress={() => this.toggleCards()} 
                    style={styles.toggleButton}
            >
              {this.state.show ? Strings.hidePlaces : Strings.showPlaces}
            </Button>   
            :
            (
              this.props.showNoPlacesTip ? 
              <View style={[styles.toggleButton, styles.tip]}>
                <Text style={styles.tipText}>Let's find somewhere new! Tap on a place on the map to add it to your lobby</Text>
              </View> : null
            )
          }  
        </View>
      </View>    
    )
  }

  toggleCards() {
    this.setState({show: !this.state.show});      
  }

  logout() {
    const { dispatch } = this.props.navigation;

    Alert.alert(
    'Logout', 
      'Are you sure you want to logout?',
      [
        {text: 'Yes', onPress: () => {
          clearInterval(this.props.getPlacesInterval);
          dispatch(
            NavigationActions.reset(
              {
                index: 0,
                actions: [
                NavigationActions.navigate({
                  routeName: 'Home',
                })
                ]
              })
          );
        }},
        {text: 'No'},
      ],
      { cancelable: true }
    )
  }

  openLobbyView() {
    const { navigate } = this.props.navigation;
    navigate('LobbyView', {source: 'http://justpick.it/?lobby=' + this.props.lobbyCode});
  }
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: 10,
    marginLeft: 10,
    width: width-20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-start',
    flexDirection: 'row',   
    justifyContent: 'center',
    borderRadius: 6
  },
  lobbyCodeContainer: {
    width: '40%',
    flexDirection: 'row',        
    justifyContent: 'center'
  },
  lobbyCode: {
    fontWeight: 'bold',   
  },
  loadingBg: {
    width: '20%',
    flex: 1
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
    elevation: 4    
  },
  toggleButton: {
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10
  },
  tip: {
    width: width-20,
    marginLeft: 10,
  },
  tipText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});