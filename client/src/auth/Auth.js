import Api from './Api'
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';

let type = null
let token = null

export default class Auth {

    static async login (email, password) {
        try {
          let res = await Api.login(email, password)
          let { data } = res
    
          type = data.type
          token = data.token

          localStorage.setItem("jwtToken", token);

          setAuthToken(token);
          const decoded = jwt_decode(token);
          console.log(decoded)
          return true 
        } catch (error) {
          console.log(error)
          return false
        }
      }

    static isAdmin () {
        return type === 'ADMIN'
      }
    
      static isUser () {
        return type === 'USER'
      }
}