import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { toPlaceName } from '../utils/helpers';
import * as Config from '../utils/config';

export default class Marker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colour: ''
    }
  }

  componentWillMount() {
    let { place } = this.props;

    fetch(Config.serverURL + '/get-colour?lobby=' + place.lobby + '&name=' + place.author)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({colour: responseJson.resp});   
    });
  }

  render() {
    if(!this.state.colour) return null;

    return (
      <View style={[styles.circle, {backgroundColor: this.state.colour}]}>
        <Text style={{color: 'white'}}>{toPlaceName(this.props.title).substring(0, 1).toUpperCase()}</Text>
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
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  }
});