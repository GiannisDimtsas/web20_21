import React from 'react'
import { Button } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

function Admin() {
    const { path, url } = useRouteMatch()
        return(
                    <div className="center">
                        <h4>
                            Welcome Adminstrator<h5>Please choose one of the next options</h5>
                        </h4>
                        <br />                    
                        <ButtonGroup vertical>
                            <Button as={Link} to={`${url}/basic-info`}>Basic Information</Button>
                            <Button as={Link} to={`${url}/response-time-analyzation`}>response time analyzation</Button>
                            <Button as={Link} to={`${url}/header-analyzation`}>headers analyzation</Button>
                            <Button as={Link} to={`${url}/visualizations`}>visualizations</Button>
                            <Button as={Link} to={`/`}>Logout</Button>
                        </ButtonGroup>                     
                    </div>
               
        )
}

export default Admin;