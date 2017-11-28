import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native'

export default class Marker extends React.Component {
  render() {
    let { image } = this.props;

    return (
      <View style={styles.circle}>
        <Text style={{color: 'white'}}>{this.props.title.substring(0, 1)}</Text>
        {/* <Image style={styles.image} resizeMode={'cover'} source={{uri: image}}></Image> */}
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
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  }
});