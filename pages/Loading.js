import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Animated } from 'react-native';
import * as Colours from '../utils/colours';
import * as Strings from '../utils/strings';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // phrase: Strings.splashPhrases[Math.floor(Math.random()*Strings.splashPhrases.length)]
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={{fontSize: 28, marginBottom: 5, color: 'white'}}>Just Map It</Text> */}
        {/* hacks */}
        {/* <ActivityIndicator color={Colours.primary} animating={false} size={'large'}></ActivityIndicator> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
