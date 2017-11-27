import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native'

export default class Marker extends React.Component {
  render() {
    let { image } = this.props;

    return (
      <View style={styles.circle}>
        {/* <Text style={styles.pinText}>{this.props.title}</Text> */}
        <Image style={styles.image} resizeMode={'cover'} source={{uri: image}}></Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 30
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30
  }
});