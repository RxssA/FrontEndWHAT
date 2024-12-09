import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class MapComponent extends Component {
  render() {
    const { latitude, longitude } = this.props;

    return (
      <div className="map-container">
        <Map
          google={this.props.google}
          zoom={10}
          initialCenter={{
            lat: latitude || 53.270962,  
            lng: longitude || -9.062691, 
          }}
          style={{ width: '35%', height: '60%' }} 
        >
          <Marker position={{ lat: latitude, lng: longitude }} />
        </Map>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDSfpnDPuc2y7-98CpPf2ft7L8EMS-fRgA',
})(MapComponent);
