import Heatmap from '../heatmap/Heatmap'
import React, { Component } from 'react'
import Api from './Api'
import {Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
const User = require("../../models/models")
const fs = require('fs')

let map = null

class Upload extends Component {

    constructor(props){
        super(props)
        this.state = {
            file: '',
        }
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileReader = new FileReader()
        this.fileReader.onLoad = e => {
            let result = e.target.result
            let user = User.findOne({displayName: user.displayName})
            let email = user.email;
            fs.writeFile(result,JSON.stringify(email))
        }

    }


    onChange (e) {
        this.setState({ file: e.target.files[0] }, () => {
          this.fileReader.readAsText(this.state.file)
        })
      }
    
    onClick (e) {
        e.preventDefault()
        Api.uploadObject(this.state.result).then(r => console.log('file uploaded'))
    }



    render() {
        return(
            <div className="center">
                <Button as={Link} to={`/user`}>back</Button>
                <form>
                    <h3>Upload your file</h3>
                    <p>You can upload your data with safety.</p>
                    <hr />
                    <h3>Choose file</h3>
                    <p>Don't upload data over 300mb.</p>
                    <input id="file" type="file" name="selectedFile" onChange={this.onChange} />    
                    <button type="submit" className="btn btn-success col-md-auto" onClick={this.onClick}>Upload</button>   
                </form>
            </div>
        )
    }
}

export default Upload;