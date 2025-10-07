const {ImageUploadUtils}=require('../config/cloudinary')

const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const url = "data:" + req.file.mimetype + ";base64," + b64
        const result = await ImageUploadUtils(url)
        res.json({
            success: true,
            data:result,
            message:"image Uploaded!"
        })
    } catch (error) {
        
        res.json({
            
            success: false,
            message: "Error Occured"
        })
    }
}
module.exports =handleImageUpload