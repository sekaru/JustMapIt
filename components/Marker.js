import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { toPlaceName } from '../utils/helpers';

export default class Marker extends React.Component {
  render() {
    let { image } = this.props;

    return (
      <View style={styles.circle}>
        <Text style={{color: 'white'}}>{toPlaceName(this.props.title).substring(0, 1).toUpperCase()}</Text>
        {/* <FastImage style={styles.image} resizeMode={'cover'} source={{uri: image}}></FastImage> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'orange'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  }
});