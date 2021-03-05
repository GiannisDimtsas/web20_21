const User = require("../../models/models")
const axios = require('axios')


let instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// This is the Users' API. This API connects the routes with the components in order to get or post data.

class Api {
  uploadObject = (data,email) => { 
    return instance.post('/user/upload',data,email)
  }

  getLatLon = () => {
    return instance.get('/user/visualizations/get-lat-lon')
  }

  lastUpload = () => {
    return instance.get('/user/profile-management/last-upload')
  }
}

export default new Api()