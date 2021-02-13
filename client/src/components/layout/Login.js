/* eslint-disable */
import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Api from '../../auth/Api'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: ''
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

    onSubmit = async (e) => { //function for handling button submits
        e.preventDefault();
        const {email, password} = this.state;
        let res = await Api.login(email, password)
        let { data } = res
        console.log(data)
        if(data.user.type==='ADMIN'){
            this.props.history.push('/admin')
        } else if(data.user.type==='USER'){
            this.props.history.push('/user')
            console.log(data.token)
        }else{
            this.props.history.push('/')
        }

    }

    render(){
        return(
            <div className="Login">
                <Form onSubmit={this.onSubmit}>
                    <h3 className="text-center"> Please login</h3>

                    <Form.Group controlId="email">
                        <Form.Control required type="text" name="email" placeholder="Email address" onChange={this.onChange}/>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Control required type="password" name="password" placeholder="Password" onChange={this.onChange}/>
                        <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="primary" block>Log In</Button>
                    <div>
                        Not a member yet?<NavLink to="/register"> Register now</NavLink>
                    </div>
                </Form>               
            </div>
        )
    }
}

export default Login;