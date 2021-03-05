import React, { Component } from 'react'
import Api from './Api'
import {Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

class ResponseTimeAnalyzation extends Component {
    constructor(props){
        super(props);

        this.state = {
            wait_mean: ''
        };
    }

    componentDidMount() {
        Api.waitTimeMean().then(res => {
            console.log(res);
            this.setState({wait_mean:res.data})
        })
    }


    render(){
        return(
                    
                <div className="center">
                    <Button className="center" as={Link} to={`/admin`}>back</Button>
                    <h5>Average wait time is: {this.state.wait_mean} </h5>
                </div>


        )
    }

}

export default ResponseTimeAnalyzation;