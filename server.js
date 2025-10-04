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
const imageUploaderRouter = require('./routes/imageUploadRoutes')
const userRouter=require("./routes/admin/userRoutes")
const adBannerRouter=require("./routes/admin/adBannerRoutes")
const csRouter=require("./routes/admin/csRoutes")
const sliderRouter=require("./routes/admin/sliderRoutes")
const filterRouter = require('./routes/filterRoutes')
const searchRouter = require('./routes/searchRoutes')
const addressRouter = require('./routes/addressRoutes')
const cartRouter = require('./routes/cartRoutes')
const orderRouter = require('./routes/orderRoutes')
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
app.use(express.urlencoded({ extended: true }));  
/* Routers */
app.use("/api/auth",authRouter)
app.use("/api/category",categoryRouter)
app.use("/api/products",productRouter)
app.use("/api",imageUploaderRouter)
app.use("/api/adbanner",adBannerRouter)
app.use("/api/comingsoon",csRouter)
app.use("/api/sliders",sliderRouter)
app.use("/api/users",userRouter)
app.use("/api/shop",filterRouter)
app.use("/api/search",searchRouter)
app.use("/api/address",addressRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
/* Running Server */
const port=process.env.PORT || 5000
app.listen(port,()=>{
console.log(`Running on :http://127.0.0.1:${port}`)
})