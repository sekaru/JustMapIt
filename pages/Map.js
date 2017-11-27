import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Marker from '../components/Marker';
import Callout from '../components/Callout';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: []
    }
  }

  render() {
    const window = Dimensions.get('window');
    const { width, height }  = window;
    const latitudeD = 0.0922;
    const longitudeD = latitudeD + (width / height);

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
          onPress={e => this.addMarker2(e)}
          showsUserLocation={true} 
          showsMyLocationButton={true}   
          showsTraffic={false}   
          minZoomLevel={12}   
          showsBuildings={false}
        >
          {this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.latlng}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
                image={marker.image}
              >
                {/* <Marker {...marker}></Marker> */}
                <MapView.Callout>
                  <Callout {...marker} />
                </MapView.Callout>
              </MapView.Marker>
          ))}
        </MapView>
      </View>
    );
  }

  addMarker2(e) {
    let markers = this.state.markers;
    let latlng = e.nativeEvent.coordinate;

    markers.push({
      latlng: e.nativeEvent.coordinate,
      title: 'Yay',
      description: 'This is a fairly short description',
      image: ''
    }); 

    this.setState({markers});     
  }

  addMarker(e) {
    let markers = this.state.markers;
    let latlng = e.nativeEvent.coordinate;
   
    fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latlng.latitude + ',' + latlng.longitude + '&radius=2&key=AIzaSyBAgp3ed5PJbW9lWs6nIvWhv41KjPikYQ0')
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.results.length>0) {
        responseJson.results.some(result => {
          let isPlace = result.types.some(r => ['bar', 'restaurant', 'food', 'point_of_interest'].indexOf(r) >= 0);
          if(isPlace) {
            markers.push({
              latlng: {latitude: result.geometry.location.lat, longitude: result.geometry.location.lng},
              title: result.name,
              description: result.place_id,
              image: result.photos ? 'https://maps.googleapis.com/maps/api/place/photo?photoreference=' + result.photos[0].photo_reference + '&maxwidth=250&key=AIzaSyBAgp3ed5PJbW9lWs6nIvWhv41KjPikYQ0' : ''
            }); 

            this.setState({markers}); 
            return isPlace;
          }
        })
      }   
    })
    .catch((error) => {
      console.error(error);
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
