import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native'

export default class Callout extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.title}>{this.props.title}</Text>        
        <Text>{this.props.description}</Text>
        <Button title={"Add to Lobby"}></Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  }
});