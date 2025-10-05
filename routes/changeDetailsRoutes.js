const express = require("express");
const router = express.Router();
const {
  updateUserName,
  requestEmailChange,
  verifyEmailChange,
} = require("../controller/ChangeController");

router.post("/change-name",updateUserName)
router.post("/send-otp",requestEmailChange)
router.post("/change-email",verifyEmailChange)

module.exports = router;