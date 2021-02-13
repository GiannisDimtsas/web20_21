import AdminMap from '../heatmap/AdminMap'
import React, { Component } from 'react'

class AdminVisualizations extends Component {
    render() {
        return(
            <div className="center">
                <h3>Visualizations</h3>
                <p>Here you can see the locations of the IPs that have sent a request</p>
                <AdminMap />
                
            </div>
        )
    }   
}

export default AdminVisualizations;