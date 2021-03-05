import React, { Component } from 'react'
import Api from './Api'
import {Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

class basicInfo extends Component {
    constructor(props){
        super(props);

        this.state = {
            numberOfTotalUsers: '',
            getMethods: '',
            postMethods: '',
            statusId: [],
            countStatus: [],
            domains: ' ',

        };
    }

    componentDidMount() {
        //Connects routes with component
        Api.numberOfTotalUsers().then(res => {
            console.log(res);
            this.setState({numberOfTotalUsers:res.data})
        });

        Api.countGetMethods().then(res => {
            console.log(res);
          
            this.setState({getMethods: res.data[0].count})
        });

        Api.countPostMethods().then(res => {
            console.log(res);
            if(res.data.length > 1){
                this.setState({postMethods: res.data[0].count})
            } else {
                this.setState({postMethods: 0})
            }
            
        }); 
        
        Api.getStatus().then(res => {
            let statusId = [];
            let countStatus = [];
            console.log(res)
            let i;
            for(i=0; i<res.data.length; i++){
                statusId[i] = res.data[i]._id;
                countStatus[i] = res.data[i].count;
                
            }
            this.setState({statusId: statusId, countStatus: countStatus});  
        })       
        
        Api.countUniqueDomains().then(res => {
            console.log(res);
            this.setState({domains: res.data.length})
        })
    }

    render() {
        return(
            <div className="center">
                <Button className="right" as={Link} to={`/admin`}>back</Button>
                <h3>This is the basic information dashboard</h3>
                <h5>Number of total users is: {this.state.numberOfTotalUsers} </h5>
                <h5>Number of total GET methods is: {this.state.getMethods} </h5>
                <h5>Number of total Post methods is: {this.state.postMethods} </h5>
                <h5>Number of total unique domains is: {this.state.domains}</h5>
                <h5>Number of total status messages: </h5>
                <table>
                    <thead>
                        <tr>
                            <th>Status Id:</th>
                            <th>Times appeared:</th>
                        </tr> 
                    </thead>
                    
                    <tbody>
                        {
                            <tr>
                                <td>
                                    {this.state.statusId.map((statusid) =>(
                                        <li>{statusid} </li>
                                    ))}
                                    
                                </td>
                                <td>
                                    {this.state.countStatus.map((times) =>(
                                        <li>{times} </li>
                                    ))}
                                </td>
                            </tr>                            
                        }
                        
                    </tbody>

                </table>
            </div>
        )
    }
}

export default basicInfo;