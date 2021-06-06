const express = require("express");
const router = express.Router();
const genderController = require("../controller/genders");
const multer = require("multer");
const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/genders");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/all-gender", genderController.getAllGender);
router.post(
  "/add-gender",
  loginCheck,
  upload.single("gImage"),
  genderController.postAddGender
);
router.post("/edit-gender", loginCheck, genderController.postEditGender);
router.post("/delete-gender", loginCheck, genderController.getDeleteGender);

module.exports = router;
