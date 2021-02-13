const axios = require('axios')

let instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

class Api {
  register = ( email, password, password2,displayName) => {
    return instance.post('/register', { email: email, password: password, password2: password2, displayName: displayName })
  }

  login = (email, password) => {
    return instance.post('/login', { email: email, password: password })
  }

  logout = () => {
    return instance.post('/logout')
  }
}

export default new Api()