import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-root-toast';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  toPlaceName(link) {
    let trimmedLink = link;
    if(trimmedLink.startsWith("http://")) {
      trimmedLink = trimmedLink.substring(7);
    } else if(trimmedLink.startsWith("https://")) {
      trimmedLink = trimmedLink.substring(8);
    }

    if(trimmedLink.startsWith("www.")) trimmedLink = trimmedLink.substring(4);
    let dot = trimmedLink.indexOf(".");
    if(dot!==-1) trimmedLink = trimmedLink.substring(0, dot);
    trimmedLink = trimmedLink.replace("-", " ");

    return trimmedLink.toUpperCase();
  }

  render() {
    const { link, image, desc, latlng, status } = this.props;

    return (
      <View style={[styles.card, {width: this.props.cardW, height: this.props.cardH}]}>
        <FastImage
          source={{uri: image}}
          style={styles.cardImage}
          resizeMode={'cover'}
        />
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>{status ? desc.split(' @ ')[0] : this.toPlaceName(link)}</Text>
          {
            status &&
            <Text numberOfLines={3} style={[styles.cardStatus, {color: status==='Open now' ? 'green' : 'red'}]}>{status}</Text>          
          }
          <Text numberOfLines={3} style={styles.cardDescription}>
            {status ? desc.split(' @ ')[1] : desc}
          </Text>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Button onPress={() => this.buttonAction()} style={styles.button}>{this.getButtonText()}</Button>            
          </View>
        </View>
      </View>    
    )
  }

  addToast(message) {
    let toast = Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
    });
  }

  getButtonText() {
    const { mode, latlng } = this.props;
    if(mode==0) {
      return latlng ? 'Show on Map' : 'Set Location';
    } else {
      return 'Add to Lobby';
    }
  }

  buttonAction() {
    if(this.props.mode==0) {
      return latlng ? 'Show on Map' : 'Set Location';
    } else {
      this.addToLobby();
    }
  }

  addToLobby() {
    const { lobbyCode, link, image, desc, latlng } = this.props;

    fetch('http://52.58.65.213:3000/add-place', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobby: lobbyCode,
        link: link,
        image: image,
        author: 'Tudor',
        price: '€0',
        desc: desc,
        latlng: latlng
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        this.addToast('Successfully added ' + this.props.desc.split(' @ ')[0] + ' to your lobby!');
      } else {
        this.addToast('Error adding this place to your lobby!');          
      }
    });
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
  button: {
    color: 'orange'
  }
});