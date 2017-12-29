import React from 'react';
import MapView from 'react-native-maps';

const padding = 150;
const EDGE_PADDING = {
  top: padding,
  left: padding,
  bottom: padding,  
  right: padding
}

export default class PaddedMapView extends React.Component {
  fitToMarkers = () => {
    const markers = React.Children.map(
      this.props.children,
      child => child.props.coordinate
    )
    const options = {
      edgePadding: EDGE_PADDING,
      animated: true
    }
    this.ref.fitToCoordinates(markers, options)
  }

  animateToRegion = (region, speed) => {
    this.ref.animateToRegion(region, speed);
  }

  render() {
    return (
      <MapView
        ref={(map) => {
          this.ref = map
        }}
        onLayout={this.fitToMarkers}
        {...this.props}
      />
    )
  }
}