const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors=require('cors')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
/* Database connection */ 
const  setConnection  = require('./config/db')
setConnection()

const app = express()
/* MiddleWare */
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())

/* Running Server */
const port=process.env.PORT || 5000
app.listen(port,()=>{
console.log(`Running on :http://127.0.0.1:${port}`)
})