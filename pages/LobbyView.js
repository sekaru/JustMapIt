import React from 'react';
import { StyleSheet, Text, View, WebView, Dimensions } from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/EvilIcons'; 

const { width } = Dimensions.get("window");

export default class LobbyView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { goBack, state } = this.props.navigation;
    const source = state.params.source;

    return (
      <View style={{
        position:"absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }}>
        <View style={styles.navbar}>
          <Button onPress={() => goBack()}>
            <Icon name="close" size={24} color="#007aff" />
          </Button>
          <Text style={styles.link}>{source}</Text>
        </View>
        <WebView
          source={{uri: source}}
          style={{marginTop: 40}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute', 
    width: width, 
    height: 40, 
    backgroundColor: 'white', 
    elevation: 4, 
    padding: 4, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  link: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginLeft: 10
  }
});
