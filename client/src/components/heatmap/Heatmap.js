import React, { Component } from 'react'
import L from 'leaflet'
import HeatmapOverlay from 'leaflet-heatmap'

  
  
class Heatmap extends Component {

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
    this.setState(this.state.testData={
      max:8,
      data:[
            {lat: 40.183800, lng:21.190010, count: 8}, 
            {lat: 47.75, lng:-3.55, count: 4},
            {lat: 30.27500, lng:29.129030, count: 1}, 
            {lat: 60.183800, lng:12.94040, count: 6}, 
            {lat: 14.159200, lng:19.48028, count: 3}, 
            {lat: 20.592800, lng:45.12738, count: 8}, 
            {lat: 3.783270, lng:27.11930, count: 7}, 
            {lat: 41.183800, lng:-2.17021, count: 8}, 
            {lat: 31.26500, lng:29.127021, count: 5}, 
            
          ]
        }
      )
    const map = L.map('map').setView(this.position1, 5.5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    this.heatmapLayer = new HeatmapOverlay(this.cfg).addTo(map)
    
    this.heatmapLayer.setData(this.state.testData)
    console.log(this.state.testData)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.data) {
      this.heatmapLayer.setData({ max: 1, data: this.state.testData })
    }
  }

  render () {
    return (
      <div id="map"/>
    )
  }
}

export default Heatmap;