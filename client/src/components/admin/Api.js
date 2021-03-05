const axios = require('axios')

let instance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
})


// This is the Admin's API. It connects routes with the admin's components in order to get data from the DB.

class Api {
    numberOfTotalUsers = () => {
        return instance.get("/admin/basic-info")
    }

    countGetMethods = () => {
        return instance.get("/admin/basic-info/get-methods")
    }
    
    countPostMethods = () => {
        return instance.get("/admin/basic-info/post-methods")
    }

    getStatus = () => {
        return instance.get('/admin/basic-info/get-status')
    }

    countUniqueDomains = () => {
        return instance.get('/admin/basic-info/domains')
    }

    waitTimeMean = () =>{
        return instance.get('/admin/response-time-analyzation')
    }
}

export default new Api()