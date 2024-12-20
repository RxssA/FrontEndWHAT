import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class MapComponent extends Component {
  componentDidUpdate(prevProps) {
    const { latitude, longitude, google } = this.props;

    if (latitude !== prevProps.latitude || longitude !== prevProps.longitude) {
      const map = this.mapRef.map; 
      const newCenter = new google.maps.LatLng(latitude, longitude);
      map.panTo(newCenter); 
    }
  }

  render() {
    const { latitude, longitude } = this.props;

    return (
      <div className="map-containerH">
        <Map
          google={this.props.google}
          zoom={10}
          initialCenter={{
            lat: latitude || 53.270962, 
            lng: longitude || -9.062691, 
          }}
          style={{ width: '30%', height: '55%' }}
          ref={(ref) => (this.mapRef = ref)} 
        >
          <Marker position={{ lat: latitude, lng: longitude }} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBdTVV2PTvMrIAlIXRZ1oGyXrjbcQFaDiY',
})(MapComponent);
