const mongoose=require('mongoose')

const  setConnection=async()=>{
  await mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("Database Connected..")
    }).catch((err)=>{
        console.log("Error Occurred",err.message)
    })
}

module.exports= setConnection

