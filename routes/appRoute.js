const controller = require('./../controller/appController')

let setRouter = (app) =>{

    baseUrl = 'api/v1'

    app.post(`${baseUrl}/user/login`, controller.login)

    app.post(`${baseUrl}/user/signup`, controller.signup)

    app.get(`${baseUrl}/user/all`, controller.getAllUser)

}


module.exports = {
    setRouter : setRouter
}