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
      places: [],
      show: true,
      loading: true
    }
  }

  componentWillMount() {
    setTimeout(() => {
      fetch('http://52.58.65.213:3000/get-places?lobby=' + this.props.lobbyCode + '&sort=1')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({places: responseJson, loading: false});
      })
    }, 2000)
    
  }

  componentDidMount() {
  }

  toCard(place) {
    return (
      <Card key={place.link} {...place} />
    )
  }

  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.lobbyCodeContainer}>
          <Text style={styles.lobbyCode}>Lobby: {this.props.lobbyCode}</Text>          
        </View>

        <ActivityIndicator animating={this.state.loading} size={'large'} color={'orange'}></ActivityIndicator>                                              

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
          style={styles.scrollView}        
        >
          {this.state.show ? this.state.places.map((place) => place.archived ? null : this.toCard(place)) : null}
        </ScrollView> 

        <View style={styles.toggleButtonContainer}>
          {
            !this.state.loading && 
            <Button onPress={this.toggleCards.bind(this)} 
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
    this.setState({show: !this.state.show})
  }
}

const styles = StyleSheet.create({
  lobbyCodeContainer: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: 'flex-start'
  },
  lobbyCode: {
    fontWeight: 'bold',   
  },
  scrollViewContainer: {
    paddingRight: 10,
    alignItems: 'center',
  },
  scrollView: {
    width: width,
    height: cardH
  },
  toggleButtonContainer: {
    flex: 1,
    justifyContent: 'flex-start',  
  },
  toggleButton: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10
  }
});