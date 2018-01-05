import React from 'react';
import { StyleSheet, Text, View, WebView, Dimensions, ActivityIndicator } from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/EvilIcons'; 
import * as Colours from '../utils/colours';

const { width } = Dimensions.get("window");

export default class LobbyView extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLoading() {
    return (
      <ActivityIndicator
        color={Colours.primary}
        size='large'
        style={styles.loading}
      />
    );
  }

  render() {
    const { goBack, state } = this.props.navigation;
    const source = state.params.source;

    return (
      <View style={{flex: 1}}>
        <View style={styles.navbar}>
          <Button style={{flex: 1}} onPress={() => goBack()}>
            <Icon name="close" size={24} color={Colours.button} />
          </Button>
          <Text numberOfLines={1} style={styles.link}>{source}</Text>
        </View>
        <WebView
          renderLoading={this.renderLoading}
          source={{uri: source}}
          style={{marginTop: 40, flex: 1}}
          startInLoadingState={true}
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
    padding: 5, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  link: {
    flex: 1,
    marginLeft: 5
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
