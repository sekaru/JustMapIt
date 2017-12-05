import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Marker from '../components/Marker';
import Callout from '../components/Callout';
import Cards from '../components/Cards';
import Toast from 'react-native-root-toast';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
      markers: [],
      lobbyPlaces: [],
      tempPlaces: []
    }
  }

  componentWillMount() {
    this.getLobbyPlaces();
  }

  getLobbyPlaces() {
    const { state } = this.props.navigation;
    
    fetch('http://52.58.65.213:3000/get-places?lobby=' + state.params.lobbyCode + '&sort=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({lobbyPlaces: responseJson});
    })
  }

  render() {
    const window = Dimensions.get('window');
    const { width, height }  = window;
    const latitudeD = 0.0922;
    const longitudeD = latitudeD + (width / height);
    
    const { state } = this.props.navigation;

    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 51.509865,
            longitude: -0.118092,
            latitudeDelta: latitudeD,
            longitudeDelta: longitudeD,
          }}
          style={styles.map}
          onPress={e => this.tapMap(e)}
          showsUserLocation={true} 
          showsMyLocationButton={true}   
          showsTraffic={false}   
          minZoomLevel={12}   
          showsBuildings={false}
        >
          {this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.latlng.latitude}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              >
                <Marker {...marker} />
                <MapView.Callout>
                    <Callout {...marker} />
                </MapView.Callout>
              </MapView.Marker>
          ))}

        </MapView>

        <Cards ref='cards' mode={this.state.mode} lobbyCode={state.params ? state.params.lobbyCode : null} tapLobbyCode={() => this.tapLobbyCode()} places={this.state.mode==0 ? this.state.lobbyPlaces : this.state.tempPlaces} />      
      </View>
    );
  }

  radius() {
    return '&radius=6';
  }

  key() {
    return '&key=AIzaSyBAgp3ed5PJbW9lWs6nIvWhv41KjPikYQ0';
  }

  tapLobbyCode() {
    this.setState({mode: 0});  
    this.showCardsIfNotShown();
  }

  showCardsIfNotShown() {
    if(!this.refs.cards.state.show) {
      setTimeout(() => {
        this.refs.cards.setState({loading: false});      
      }, 50);

      this.refs.cards.toggleCards();      
    } 
  }

  addToast(message) {
    let toast = Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
    });
  }

  canTapMap() {
    return !this.refs.cards.state.show;
  }

  tapMap(e) {
    if(!this.canTapMap()) {
      this.addToast('Tap the hide places button first to find new places');
      return;
    }

    let latlng = e.nativeEvent.coordinate;
    let tempPlaces = [];    
    this.refs.cards.setState({loading: true});
   
    fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latlng.latitude + ',' + latlng.longitude + this.radius() + this.key())
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.results.length>0) {
        let foundSomething;

        responseJson.results.forEach(result => {
          let isPlace = result.types.some(r => ['bar', 'restaurant', 'food', 'point_of_interest'].indexOf(r) >= 0);
          if(isPlace && result.photos) {
            // markers.push({
            //   latlng: {latitude: result.geometry.location.lat, longitude: result.geometry.location.lng},
            //   title: result.name,
            //   description: result.place_id,
            //   image: result.photos ? 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + result.photos[0].photo_reference + '&maxwidth=250' + this.key() : ''
            // }); 
            foundSomething = true;

            this.getPlaceInfo(result.place_id)
            .then(place => {
              if(place.result.website) {
                tempPlaces.push({
                  link: place.result.website,
                  desc: place.result.name + ' @ ' + place.result.vicinity,
                  image: 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + result.photos[0].photo_reference + '&maxwidth=250' + this.key(),
                  place_id: place.result.place_id,
                  latlng: latlng,
                  status: place.result.opening_hours.open_now ? 'Open now' : 'Closed now, usually opens at ' + place.result.opening_hours.periods[0].open.time
                });
                this.setState({mode: 1, tempPlaces});
              }           
            });
          }
        });

        if(foundSomething) {
          this.setState({tempPlaces});                       
          this.showCardsIfNotShown();
        } else {
          this.addToast('Couldn\'t find any places!');      
          this.refs.cards.setState({loading: false});  
        } 
      }  
    })
    .catch((error) => {
      this.addToast('Couldn\'t find any places!');      
      this.refs.cards.setState({loading: false});  
    });
  }

  getPlaceInfo(place_id) {
    return fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + this.key())
           .then((response) => response.json())
           .then((responseJson) => {
              return responseJson;
           });
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
