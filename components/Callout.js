import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Button from 'react-native-button';
import { toPlaceName } from '../utils/utilFunctions';

export default class Callout extends React.Component {
  render() {
    const { image, title, description } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{toPlaceName(title)}</Text>        
        <Text style={styles.description}>{description}</Text>
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
    marginBottom: 10,
  },
  description: {
    marginBottom: 8
  }
});