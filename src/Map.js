import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class MapComponent extends Component {
    render() {
      return (
        <div className="map-container">
          <Map
            google={this.props.google}
            zoom={10}
            initialCenter={{
              lat: 53.270962, // Latitude
              lng: -9.062691, // Longitude
            }}
            style={{ width: '100%', height: '100%' }} // Ensure the map fits its container
          >
            <Marker position={{ lat: 53.270962, lng: -9.062691 }} />
          </Map>
        </div>
      );
    }
  }

// Make sure to replace 'YOUR_API_KEY_HERE' with your actual Google Maps API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCesQpYE8Q7U-GMYiTbtvnbqBFRUfTLXq0',
})(MapComponent);