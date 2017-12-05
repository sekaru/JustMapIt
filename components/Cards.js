import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import Button from 'react-native-button';
import Card from './Card';

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

  componentWillMount() {
    fetch('http://52.58.65.213:3000/get-places?lobby=' + this.props.lobbyCode + '&sort=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({places: responseJson, loading: false});
    })
  }

  componentDidMount() {
  }

  toCard(place) {
    return (
      <Card key={place.link} {...place} lobbyCode={this.props.lobbyCode} cardW={cardW} cardH={cardH} mode={this.props.mode} />
    )
  }

  render() {
    const { mode, tapLobbyCode, lobbyCode, places } = this.props;

    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.lobbyCodeContainer}>
          <Button disabled={mode==0} onPress={tapLobbyCode} style={styles.lobbyCode}>Lobby: {lobbyCode}</Button>          
        </View>

        <View style={[{backgroundColor: this.state.loading ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0)'}, styles.loadingBg]}>
          <ActivityIndicator animating={this.state.loading} size={'large'} color={'orange'}></ActivityIndicator>                                                        
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
              {this.state.show ? 'Hide Places' : 'Show Places'}
            </Button>   
          }  
        </View>
      </View>    
    )
  }

  toggleCards() {
    if(!this.state.show) {
      this.setState({loading: true});
      setTimeout(() => {
        this.setState({show: !this.state.show, loading: false});    
      }, 50);
    } else {
      this.setState({show: !this.state.show});      
    }
  }
}

const styles = StyleSheet.create({
  lobbyCodeContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: 'flex-start'
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