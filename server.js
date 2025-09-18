const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors=require('cors')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
/* Database connection */ 
const  setConnection  = require('./config/db')
/* Routes */ 
const authRouter = require('./routes/authRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const productRouter = require('./routes/productRoutes')
setConnection()

const app = express()
/* MiddleWare */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];
app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())
/* Routers */
app.use("/api/auth",authRouter)
app.use("/api/category",categoryRouter)
app.use("/api/products",productRouter)

/* Running Server */
const port=process.env.PORT || 5000
app.listen(port,()=>{
console.log(`Running on :http://127.0.0.1:${port}`)
})