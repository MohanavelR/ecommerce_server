
const nodemailer =require('nodemailer')

const transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.NODE_EMAIL,
            pass:process.env.NODE_EMAIL_PASSWORD      
          }
       })
       
module.exports = transporter