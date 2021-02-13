const User = require("../../models/models")
const axios = require('axios')


let instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

class Api {
  uploadObject = (data) => {    
    return instance.post('/user/upload', data)
  }

  getLatLon = () => {
    return instance.get('/user/visualizations/get-lat-lon')
  }

  lastUpload = () => {
    return instance.get('/user/profile-management/last-upload')
  }
}

export default new Api()