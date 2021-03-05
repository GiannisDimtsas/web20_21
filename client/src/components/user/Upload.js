import React, { Component } from 'react'
import Api from './Api'
import {Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {Preprocessor} from './Preprocessor'

const User = require("../../models/models")

let map = null

class Upload extends Component {

    constructor(props){
        super(props)
        this.state = {
            file: '',
            data: ''
           
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileReader = new FileReader();
        this.fileReader.onload = e =>{
            let preprocessor = new Preprocessor();
            let data = preprocessor.parse(JSON.parse(e.target.result));
            this.setState({data:data})
            console.log(this.state.data)
        }   
    }

 
    onChange (e) {
        this.setState({ file: e.target.files[0] }, () => {
          this.fileReader.readAsText(this.state.file)
        })
      }
    
    onFormSubmit (e) {
        e.preventDefault()
        let email  = localStorage.getItem('email')      
        Api.uploadObject(this.state.data,email).then(r => console.log('file uploaded'))
    }

    componentDidMount(){

    }
    render() {
        return(
            <div className="center">
                
                <Button as={Link} to={`/user`}>back</Button>
                <form onSubmit={this.onFormSubmit}>
                    <h3>Upload your file</h3>
                    <p>You can upload your data with safety.</p>
                    <hr />
                    <h3>Choose file</h3>
                    <p>Don't upload data over 50mb.</p>
                    <input id="file" type="file" name="selectedFile" onChange={this.onChange} />    
                    <button type="submit" className="btn btn-success col-md-auto">Upload</button>   
                </form>
            </div>
        )
    }
}

export default Upload;