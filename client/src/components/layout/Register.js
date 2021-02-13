/* eslint-disable */

import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import axios from 'axios';


class Register extends Component{
    constructor() {
        super();
        this.state = {
          displayName: '',
          email: '',
          password: '',
        };
      }
    

      onChange = (e) => { //function for handling input values
        const target = e.target
        const value = target.value
        const name = target.name
        const state = this.state

        state[name] = value
        this.setState(state)
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const {email, password,displayName} = this.state;
        axios.post("/register", { email: email, password: password, displayName: displayName })
        .then((result) => {
          this.props.history.push("/login")
        })
        .catch((error) => {
            console.log(error.response)
        })    
    }

    render() {
        return(
            <div className="Register">
                <Form onSubmit={this.onSubmit}>

                    <h3 className="text-center">Please register</h3>     

                    <Form.Group controlId="email"> 
                        <Form.Control required type="text" name="email"
                                    placeholder="Email address" onChange={this.onChange}/>
                        <Form.Control.Feedback type="invalid">Please enter a valid
                        email.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Control required type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                        <Form.Control.Feedback type="invalid">Must be min. 8 characters
                        including at least an
                        uppercase letter, a number and a symbol.</Form.Control.Feedback>
                        <small id="passwordHelpBlock" className="form-text text-muted">
                        Your password must be at least 8 characters long, must contain at
                        least an uppercase
                        letter
                        a number and a symbol (e.g #$*&@).
                        </small>
                    </Form.Group>

                    <Form.Group>
                        <Form.Control required type="password" name="passwordRetype" placeholder="Retype password" onChange={this.onChange}/>
                        <Form.Control.Feedback type="invalid">Passwords must match.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="name"> 
                        <Form.Control required type="text" name="name" placeholder="Name" onChange={this.onChange} />
                        <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="primary" block>Register</Button>
                    <div>
                        Already have an account?<NavLink to="/login"> Log in</NavLink>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Register;