/* eslint-disable */
import React, { Component } from "react";
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Landing from "./components/layout/Landing";
import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import User from "./components/user/User";
import Admin from "./components/admin/Admin";
import Upload from './components/user/Upload';
import Management from './components/user/Management';
import Visualizations from './components/user/Visualizations';
import basicInfo from './components/admin/basicInfo';
import AdminVisualizations from './components/admin/AdminVisualizations';

import "./App.css";

function App () {
    return (
        <Router>       
            <div className="App">
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/user" component={User} />
              <Route exact path="/admin" component={Admin} />
              <Route exact path='/user/upload-object' component={Upload} />
              <Route exact path='/user/profile-management' component={Management} />
              <Route exact path='/user/visualizations' component={Visualizations} />
              <Route exact path='/admin/basic-info' component={basicInfo} />
              <Route exact path='/admin/visualizations' component={AdminVisualizations} />
             

            </div>
        </Router>          
    )
  
}
const container = document.getElementById('container');
container ? ReactDOM.render(<App/>, container) : false;
export default App;