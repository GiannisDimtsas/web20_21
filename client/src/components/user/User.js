import React from 'react'
import { Navbar } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { Button } from 'react-bootstrap'

const axios = require('axios')

function User () {
    const { path, url } = useRouteMatch()

    return(
        <div>
            <Navbar.Collapse className="Options" align="center">
                <h3 className="text-center">Welcome </h3>
                <p>Please choose one of the next options</p>
                <ButtonGroup vertical>
                    <Button as={Link} to={`${url}/upload-object`}>Upload</Button>
                    <Button as={Link} to={`${url}/profile-management`}>Profile management</Button>
                    <Button as={Link} to={`${url}/visualizations`}>Visualizations</Button>
                    <Button>Logout</Button>
                </ButtonGroup>
            </Navbar.Collapse>
        </div>
    )  
}

export default User;