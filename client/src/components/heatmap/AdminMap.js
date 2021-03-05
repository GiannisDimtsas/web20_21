import React, { Component } from 'react'
import L from 'leaflet'

class AdminMap extends Component {

    position1 = [38.183800, 23.190030]
    cfg = {
      radius: 30,
      maxOpacity: .8,
      scaleRadius: false,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count',
    }
    heatmapLayer
  
    constructor (props) {
      super(props)
      this.state = {
        testData:{}
      }
    }
  
    componentDidMount () {
      
        
        var data1 = [ 
            [53.320108, -6.442064, 3],          ///3rd dimension is the weight
            [50.469333, 3.865472, 4],
            [60.536578, 27.117003,1],
            [53.425659, 6.859352, 4],
            [55.558194, 9.655778, 5],
            [33.064111, -80.043361, 2],
            [41.221583, -95.863867, 4],
            [33.749733, -84.584814, 3],
            [34.913444, -85.748083, 6],
            [36.241139, -95.330061, 3],
            [-33.358472, -70.697333, 2]
        ]
        var userLatLng1 = [
            [38.243303498538204,21.733360290527344]
        ];

     

      const map = L.map('map').setView(this.position1, 5.5)
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)


    
      let marker;
      for (var i = 0; i < data1.length; i++) {
        marker = new L.marker([data1[i][0],data1[i][1]]).addTo(map);
        }
      for(i=0;i<data1.length; i++){
        var polyline = L.polyline([data1[i],userLatLng1[0]], {color: 'red' }).addTo(map);  
      }  

   
      
    }
  
    componentDidUpdate (prevProps, prevState, snapshot) {

    }
  
    render () {
      return (
        <div id="map"/>
      )
    }
  }
  
  export default AdminMap;