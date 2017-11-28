import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Button from 'react-native-button';

export default class Callout extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>        
        <Text style={styles.description}>{this.props.description}</Text>
        <Button>Add to lobby</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  description: {
    marginBottom: 8
  }
});