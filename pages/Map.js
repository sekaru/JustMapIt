import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Alert } from 'react-native';
import MapView from 'react-native-maps';
import PaddedMapView from '../components/PaddedMapView';
import Marker from '../components/Marker';
import Callout from '../components/Callout';
import Cards from '../components/Cards';
import { addToast } from '../utils/toasts';
import * as Strings from '../utils/strings';
import * as Config from '../utils/config';
import { toPlaceName, hasLatLng } from '../utils/helpers';
import * as Colours from '../utils/colours';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/EvilIcons';

const window = Dimensions.get('window');
const { width, height } = window;
const latitudeD = 0.05;
const longitudeD = latitudeD + (width / height);

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
      markers: [],
      lobbyPlaces: [],
      tempPlaces: [],
      showOnMapRef: null,
      setLocationTarget: null,
      getPlacesInterval: 0,
      didFirstLobbyCheck: false
    }
  }

  componentWillMount() {
    this.setState({getPlacesInterval: setInterval(() => {
     this.getLobbyPlaces();      
    }, 5000)});
  }

  componentDidMount() {
    const { state } = this.props.navigation;

    if(state.params.cookie) addToast("Welcome back " + state.params.user.name + "!");
  }

  componentWillUnmount() {
    clearInterval(this.state.getPlacesInterval);
  }

  getLobbyPlaces() {
    const { state } = this.props.navigation;
    
    fetch(Config.serverURL + '/get-places?lobby=' + state.params.user.lobby + '&sort=1')
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.forEach(place => {
        place.showOnMap = () => this.showOnMap(place);
        place.setLocation = () => this.setLocation(place);
      });

      this.setState({lobbyPlaces: responseJson, didFirstLobbyCheck: true});
      this.setMarkers();
    });
  }

  showOnMap(place) {
    // show callout
    let markerRef = 'marker' + place.link;
    this.setState({showOnMapRef: markerRef});

    // focus on them
    this.refs.map.animateToRegion({
      latitude: place.latlng.latitude,
      longitude: place.latlng.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 300);

    // hide cards
    this.refs.cards.toggleCards();                
  }

  setLocation(place) {
    this.setState({setLocationTarget: place});

    // hide cards
    this.refs.cards.toggleCards();
  }

  setMarkers() {
    let markers = [];
    this.state.lobbyPlaces.forEach((place) => {
      if(hasLatLng(place.latlng)) markers.push({
        latlng: place.latlng,
        title: place.link,
        description: place.desc,
        place: place
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
    const { state } = this.props.navigation;

    return (
      <View style={styles.container}>
        <PaddedMapView
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
          showsMyLocationButton={false}   
          showsCompass={false}
          showsTraffic={false}     
        >
          {this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.latlng.latitude}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
                ref={'marker' + marker.place.link}
              >
                <Marker {...marker} />
                <MapView.Callout onPress={() => {this.refs['marker' + marker.place.link].hideCallout()}}>
                    <Callout {...marker} />
                </MapView.Callout>
              </MapView.Marker>
          ))}
        </PaddedMapView>

        <Cards 
          ref='cards' 
          mode={this.state.mode} 
          navigation={this.props.navigation}
          lobbyCode={state.params.user.lobby} 
          tapLobbyCode={() => this.tapLobbyCode()} 
          places={this.state.mode==0 ? this.state.lobbyPlaces : this.state.tempPlaces} 
          getLobbyPlaces={() => this.getLobbyPlaces()}
          name={state.params.user.name}
          showNoPlacesTip={this.state.lobbyPlaces.length==0 && this.state.didFirstLobbyCheck}
          interval={this.state.getPlacesInterval}
          />      

        {
          this.state.setLocationTarget!=null &&
          <View style={styles.setLocationTip}>
            <Text style={styles.setLocationTipText}>Tap to set this place's location</Text>          
            <Button onPress={() => this.setState({setLocationTarget: null})}>
              {/* <Icon name="close" size={24} color={Colours.button} /> */}
              Cancel
            </Button>
          </View>
        }
      </View>
    );
  }

  radius() {
    let zoom = Math.round(Math.log(360 / longitudeD) / Math.LN2);
    let radius = 2*(20-zoom)+1;
    console.log(radius);
  
    return '&radius=' + radius;
  }

  tapLobbyCode() {
    this.setState({mode: 0});  
    this.showCardsIfNotShown();
    this.refs.map.fitToMarkers();
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

  setNewLocation(latlng) {
    fetch(Config.serverURL + '/update-place', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobby: this.state.setLocationTarget.lobby,
        link: this.state.setLocationTarget.link,
        latlng: latlng
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.resp) {
        addToast('Successfully updated the location for ' + toPlaceName(this.state.setLocationTarget.link));
        
        this.state.setLocationTarget.latlng = latlng;
        this.setState({setLocationTarget: null});
        this.setMarkers();  
      } else {
        addToast(resp.msg);
      }
    });
  }

  tapMap(e) {
    if(this.state.setLocationTarget) {
      let latlng = e.nativeEvent.coordinate;

      Alert.alert(
      'Set Location', 
        'Are you sure you want to set ' + toPlaceName(this.state.setLocationTarget.link) + '\'s location to here?',
        [
          {text: 'Yes', onPress: () => this.setNewLocation(latlng)},
          {text: 'No', onPress: () => this.setState({setLocationTarget: null})},
        ],
        { cancelable: true }
      )
      return;
    }

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
              if(place.result.website && !this.alreadyInLobby(place.result.website) && place.result.opening_hours) {
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

  alreadyInLobby(link) {
    return this.state.lobbyPlaces.some((place) => {
      if(toPlaceName(place.link)===toPlaceName(link)) return true;
      return false;
    })
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
  },
  setLocationTip: {
    top: 60,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    width: width-20
  },
  setLocationTipText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
