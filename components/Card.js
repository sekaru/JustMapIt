import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import { addToast } from '../utils/toasts';
import * as Strings from '../utils/strings';
import * as Config from '../utils/config';
import { toPlaceName } from '../utils/helpers';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      added: false
    }
  }

  renderPriceAuthor() {
    const { price_level, price, author } = this.props;

    return (
      <View style={{marginTop: 5}}>
        {
          author &&
          <Text style={styles.cardInfo}>Added by {author}</Text>        
        }
        <Text numberOfLines={3} style={styles.cardInfo}>
          {
            price_level ? 
              this.priceScale(price_level).split('Scale')[1]
              : 
              price && price.indexOf('Scale') !=-1 ? price.split('Scale')[1] : price
          }
        </Text>
      </View>
    )
  }

  renderButton() {
    const { mode } = this.props;

    if((mode==1 && !this.state.added) || mode==0) {
      return (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button onPress={() => this.buttonAction()} style={styles.button}>{this.getButtonText()}</Button>            
        </View>
      )
    } else {
      return null;
    }
  }

  render() {
    const { link, image, desc, latlng, status, mode } = this.props;

    return (
      <View style={[styles.card, {width: this.props.cardW, height: this.props.cardH}]}>
        <FastImage
          source={{uri: image}}
          style={styles.cardImage}
          resizeMode={'cover'}
        />
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>{status ? desc.split(' @ ')[0] : toPlaceName(link)}</Text>
          
          {
            status &&
            <Text numberOfLines={3} style={[styles.cardStatus, {color: status===Strings.openNow ? 'green' : 'red'}]}>{this.getStatus(status)}</Text>          
          }

          <Text numberOfLines={3} style={styles.cardDescription}>
            {status ? desc.split(' @ ')[1] : desc}
          </Text>

          {this.renderPriceAuthor()}
          {this.renderButton()}          
        </View>
      </View>    
    )
  }

  getStatus(status) {
    if(status===Strings.openNow) return status;
    let openingTimeArr = status.split(" ");
    let openingTime = openingTimeArr[openingTimeArr.length-1];
    let formattedTime = openingTime.split('')[0] + openingTime.split('')[1] + ":" + openingTime.split('')[2] + openingTime.split('')[3];
    return Strings.closedNow + formattedTime;
  }

  getButtonText() {
    const { mode, latlng } = this.props;
    if(mode==0) {
      return latlng ? Strings.showOnMap : Strings.setLocation;
    } else {
      return Strings.addToLobby;
    }
  }

  buttonAction() {
    const { mode, latlng } = this.props;
    
    if(mode==0) {
      return latlng ? this.showOnMap() : this.setLocation();
    } else {
      this.addToLobby();
    }
  }

  showOnMap() {
    this.props.showOnMap();
  }

  setLocation() {
    this.props.setLocation();
  }

  addToLobby() {
    const { lobbyCode, link, image, desc, latlng, price_level, getLobbyPlaces } = this.props;

    fetch(Config.serverURL + '/add-place', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobby: lobbyCode,
        link: link,
        image: image,
        author: 'Tudor',
        price: price_level ? this.priceScale(price_level) : '€0',
        desc: desc,
        latlng: latlng
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        this.setState({added: true});
        addToast('Successfully added ' + desc.split(' @ ')[0] + ' to your lobby!');
        getLobbyPlaces();
      } else {
        addToast('Error adding this place to your lobby!');          
      }
    });
  }

  priceScale(price_level) {
    let scale = 'Scale';
    for(let i=0; i<price_level+1; i++) scale+='€';
    return scale;
  }
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    backgroundColor: 'white',
    marginLeft: 10,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: 'black'
  },
  textContent: {
    flex: 2,
    padding: 10,    
  },
  cardtitle: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  cardStatus: {
    fontSize: 14,    
    fontWeight: 'bold'    
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  cardInfo: {
    fontSize: 12,
    color: '#666',      
  },
  button: {
    color: 'orange'
  }
});