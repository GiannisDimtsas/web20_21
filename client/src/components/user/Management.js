import React, {Component} from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Api from './Api'

class Management extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            newPassword: '',
            newName: '',
            lastUpload: ''
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

    onSubmitPassword = async (e) => {
        e.preventDefault();
        const {email, password,newPassword} = this.state;
        axios.post("/user/profile-management/change-password", { email: email, password: password, newPassword: newPassword })
        .then((result) => {
            this.props.history.push("/user")
          })
          .catch((error) => {
              console.log(error.response)
          })         
    }

    onSubmitUsername = async (e) => {
        e.preventDefault();
        const {email, password, newName} = this.state;
        axios.post("/user/profile-management/change-username", { email: email, password: password, displayName: newName })
        .then((result) => {
            this.props.history.push("/user")
          })
          .catch((error) => {
              console.log(error.response)
          })         
    }

    componentDidMount (){
        Api.lastUpload().then(res => {
            console.log(res);
            this.setState({lastUpload:res.data});
        })
    }

    render() {
        return (
            <div className="Management">
                <div className="center">
                    <h1>Mange your profile</h1>   
                    <h4>Change your username or password</h4>
                    <Button as={Link} to={`/user`}>back</Button>
                </div>     
                <br />
                
                <br />
                <div >
                    <Form onSubmit={this.onSubmitPassword}>
                        <Form.Group controlId="email">
                            <Form.Control required type="text" name="email" placeholder="Email address" onChange={this.onChange}/>
                        </Form.Group>   

                        <Form.Group controlId="password">
                            <Form.Control required type="password" name="password" placeholder="old password" onChange={this.onChange}/>                        
                        </Form.Group>

                        <Form.Group controlId="newPassword">
                            <Form.Control required type="password" name="newPassword" placeholder="new password" onChange={this.onChange}/>
                        </Form.Group>
                        <Button type="submit" variant="primary" block>change password</Button>
                    </Form>
                </div>
                <br />
                <div>
                    <Form onSubmit={this.onSubmitUsername}>
                        <Form.Group controlId="email">
                            <Form.Control required type="text" name="email" placeholder="Email address" onChange={this.onChange}/>
                        </Form.Group>   

                        <Form.Group controlId="password">
                            <Form.Control required type="password" name="password" placeholder="password" onChange={this.onChange}/>                        
                        </Form.Group>

                        <Form.Group controlId="displayName">
                            <Form.Control required type="text" name="newUsername" placeholder="new username" onChange={this.onChange}/>
                        </Form.Group>
                        <Button type="submit" variant="primary" block>change username</Button>
                    </Form>
                </div>
                <div className="center">
                    <h4>Last upload: {this.state.lastUpload}</h4>
                </div>  
            </div>
        )         
    } 
}

export default Management;