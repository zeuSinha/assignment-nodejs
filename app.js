const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')


const app = express()
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

fs.readdirSync(modelPath).forEach((file) =>{
    if(~file.indexOf('.js'))
        require(modelPath + '/' + file)
})

const routerPath = './routes'
fs.readdirSync(routerPath).forEach((file)=>{
    if(~file.indexOf('.js')){
        let router = require(routerPath + '/' + file)
        router.setRouter(app)
    }
})

server.listen(3000, ()=>{
    console.log('Listening on port 3000')

    let db = mongoose.connect(`mongodb://localhost:27017/userData`)
})

mongoose.connection.on('open', (err, result)=>{
    if(err){
        console.log('Database connection error')
        console.log(err)
    }
    else{
        console.log('Connection to database Successful')
    }
})