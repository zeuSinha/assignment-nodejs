const mongoose = require('mongoose')

const Schema = mongoose.Schema

let userSchema = new Schema(
    {
        userId : {
            type : String,
            unique : true
        },
        firstName : {
            type : String,
            default : '',
        },
        lastName : {
            type : String,
            default : String
        },
        password: {
            type : String,
            default: ''
        },
        email : {
            type : String,
            default : ''
        }
    })

mongoose.model('User', userSchema)
