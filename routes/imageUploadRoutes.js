const { imageUploader } = require("../config/cloudinary");
const handleImageUpload =require("../controller/imageUploadController")
const router = require("express").Router();


router.post('/upload-image',imageUploader.single("image"),handleImageUpload)

module.exports=router