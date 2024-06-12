import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';






class MapContainer extends Component {
  render(user) {
    const mapStyles = {
      width: '70%',
      height: '70%'
    };

    console.log("user selected>>>",this.props.user.user.case)

    return (
      <div style={mapStyles}>
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: this.props.user.user.case.latitude,
          lng: this.props.user.user.case.longitude
        }}
      >
        <Marker position={{ lat: this.props.user.user.case.latitude, lng: this.props.user.user.case.longitude }} />
      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAqW6pMf3yLv4x5F-7ijsnkUwpySD5s_hM'
})(MapContainer);
