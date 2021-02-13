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
        Api.uploadObject(this.state.result).then(r => console.log('OK'))
    }



    render() {
        return(
            <div className="center">
                <Heatmap />
                <form>
                    <h6>Upload your file</h6>
                    <input id="file" type="file" name="selectedFile" onChange={this.onChange} />    
                    <button type="submit" className="btn btn-success col-md-auto" onClick={this.onClick}>Upload</button>                
                    <Button as={Link} to={`/user`}>back</Button>
                </form>
            </div>
        )
    }
}

export default Upload;