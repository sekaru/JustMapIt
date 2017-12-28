import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Marker from '../components/Marker';
import Callout from '../components/Callout';
import Cards from '../components/Cards';
import { addToast } from '../utils/toasts';
import * as Strings from '../utils/strings';
import * as Config from '../utils/config';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
      markers: [],
      lobbyPlaces: [],
      tempPlaces: [],
      showOnMapRef: null
    }
  }

  componentWillMount() {
    this.getLobbyPlaces();
  }

  getLobbyPlaces(remove) {
    const { state } = this.props.navigation;
    
    fetch(Config.serverURL + '/get-places?lobby=' + state.params.lobbyCode + '&sort=1')
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.forEach(place => {
        place.showOnMap = () => {
          // show callout
          let markerRef = 'marker' + JSON.stringify(place.latlng);
          this.setState({showOnMapRef: markerRef});

          // focus on them
          this.refs.map.animateToRegion({
            latitude: place.latlng.latitude,
            longitude: place.latlng.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 200);

          // hide cards
          this.refs.cards.toggleCards();                
        }
      });

      this.setState({lobbyPlaces: responseJson});
      this.setMarkers();
    });
  }

  setMarkers() {
    let markers = [];
    this.state.lobbyPlaces.forEach((place) => {
      if(place.latlng) markers.push({
        latlng: place.latlng,
        title: place.link,
        description: place.desc,
        image: place.image
      }); 
    });
    this.setState({markers});
  }

  onRegionChangeComplete() {
    if(this.refs[this.state.showOnMapRef]) {
      this.refs[this.state.showOnMapRef].showCallout();
      this.setState({showOnMapRef: null});
    }
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
          ref='map'
          initialRegion={{
            latitude: 51.509865,
            longitude: -0.118092,
            latitudeDelta: latitudeD,
            longitudeDelta: longitudeD,
          }}
          style={styles.map}
          onPress={e => this.tapMap(e)}
          onRegionChangeComplete={() => this.onRegionChangeComplete()}
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
                ref={'marker' + JSON.stringify(marker.latlng)}
              >
                <Marker {...marker} />
                <MapView.Callout onPress={() => {this.refs['marker' + JSON.stringify(marker.latlng)].hideCallout()}}>
                    <Callout {...marker} />
                </MapView.Callout>
              </MapView.Marker>
          ))}

        </MapView>

        <Cards 
          ref='cards' 
          mode={this.state.mode} 
          lobbyCode={state.params ? state.params.lobbyCode : null} 
          tapLobbyCode={() => this.tapLobbyCode()} 
          places={this.state.mode==0 ? this.state.lobbyPlaces : this.state.tempPlaces} 
          getLobbyPlaces={() => this.getLobbyPlaces()}
          />      
      </View>
    );
  }

  radius() {
    return '&radius=10';
  }

  tapLobbyCode() {
    this.setState({mode: 0});  
    this.showCardsIfNotShown();
  }

  showCardsIfNotShown() {
    if(this.canTapMap()) {
      this.refs.cards.setState({loading: false});      
      this.refs.cards.toggleCards();      
    } 
  }

  canTapMap() {
    return !this.refs.cards.state.show;
  }

  tapMap(e) {
    if(!this.canTapMap()) {
      addToast('Tap the hide places button first to find new places');
      return;
    }

    let latlng = e.nativeEvent.coordinate;
    let tempPlaces = [];    
    this.refs.cards.setState({loading: true});

    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latlng.latitude + ',' + latlng.longitude + this.radius() + Config.googleKey;

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.results.length>0) {
        // handle not finding anything
        let notFound = setTimeout(() => {
          this.handleCouldntFindPlace();
        }, 1500);

        responseJson.results.forEach(result => {
          let isPlace = result.types.some(r => ['bar', 'restaurant', 'food', 'point_of_interest'].indexOf(r) >= 0);
          if(isPlace && result.photos) {
            this.getPlaceInfo(result.place_id)
            .then(place => {       
              if(place.result.website) {
                tempPlaces.push({
                  link: place.result.website,
                  desc: place.result.name + ' @ ' + place.result.vicinity,
                  image: 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + result.photos[0].photo_reference + '&maxwidth=250' + Config.googleKey,
                  place_id: place.result.place_id,
                  latlng: latlng,
                  status: place.result.opening_hours.open_now ? Strings.openNow : Strings.closedNow + place.result.opening_hours.periods[0].open.time,
                  price_level: place.result.price_level
                });
                
                this.setState({mode: 1, tempPlaces});
                this.showCardsIfNotShown();        
                clearTimeout(notFound);  
              }           
            });
          }
        });
      }  
    })
    .catch((error) => {
      this.handleCouldntFindPlace();
    });
  }

  handleCouldntFindPlace() {
    addToast('Couldn\'t find any places!');      
    this.refs.cards.setState({loading: false});  
  }

  getPlaceInfo(place_id) {
    return fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + Config.googleKey)
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
