class Auths {
    static async auths (email) {
        try{
            localStorage.setItem('email',email)
            let auth = localStorage.getItem('email')
            return auth
        } catch(err) {
            
        }
    }
}
module.exports = Auths;