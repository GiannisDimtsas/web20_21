import Heatmap from '../heatmap/Heatmap'
import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Api from "./Api"
const axios = require('axios')


class Visualizations extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
           lat : '',
           lon : '',
           data:{},
           token: ''
        };
    }

    
    componentDidMount() {
           
            Api.getLatLon().then(res => {
                console.log(res);
                this.setState({
                    lat:res.data,
                    lon: res.data
                })
            });
            
        }
    componentDidUpdate(prevProps, prevState, snapshot){

    }

    

    render() {
        return(
            <div className="center">
                <h3>Visualizations</h3>
                <Button as={Link} to={`/user`}>back</Button>
                <Heatmap />
            </div>
        )
    }   
}

export default Visualizations;