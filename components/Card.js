import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get("window");

const cardW = 250;
const cardH = 300;

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
    const { link, image, desc, latlng } = this.props;

    return (
      <View style={styles.card}>
        <FastImage
          source={{uri: image}}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>{this.toPlaceName(link)}</Text>
          <Text numberOfLines={3} style={styles.cardDescription}>
            {desc}
          </Text>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Button style={styles.button}>{latlng ? 'Show on Map' : 'Set Location'}</Button>            
          </View>
        </View>
      </View>    
    )
  }
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    backgroundColor: 'white',
    marginLeft: 10,
    // shadowColor: "#000",
    // shadowRadius: 5,
    // shadowOpacity: 0.3,
    // shadowOffset: { x: 2, y: -2 },
    width: cardW,    
    height: cardH,
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
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  button: {
    color: 'orange'
  }
});