import React, { Component } from 'react';
import { Map, Marker, Polyline, GoogleApiWrapper } from 'google-maps-react';

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
    const { latitude, longitude, zoom, style, path } = this.props;

    const polylineOptions = {
      strokeColor: '#FF0000', // Red line
      strokeOpacity: 0.8,
      strokeWeight: 2,
    };

    const defaultStyle = {
      width: '100%',
      height: '100%',
      position: 'relative'
    };

    return (
      <div style={{ width: '100%', height: '400px', position: 'relative' }}>
        <Map
          google={this.props.google}
          zoom={zoom || 14}
          initialCenter={{
            lat: latitude || 53.270962,
            lng: longitude || -9.062691,
          }}
          style={style || defaultStyle}
          ref={(ref) => (this.mapRef = ref)}
          containerStyle={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          {latitude && longitude && (
            <Marker position={{ lat: latitude, lng: longitude }} />
          )}

          {path && path.length > 0 && (
            <Polyline path={path} options={polylineOptions} />
          )}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapComponent);
