const { toTitleCase } = require("../config/function");
const genderModel = require("../models/genders");
const fs = require("fs");

class Gender {
  async getAllGender(req, res) {
    try {
      let Genders = await genderModel.find({}).sort({ _id: -1 });
      if (Genders) {
        return res.json({ Genders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddGender(req, res) {
    let { gName, gDescription, gStatus } = req.body;
    let gImage = req.file.filename;
    const filePath = `../server/public/uploads/genders/${gImage}`;

    if (!gName || !gDescription || !gStatus || !gImage) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All filled must be required" });
      });
    } else {
      gName = toTitleCase(gName);
      try {
        let checkGenderExists = await genderModel.findOne({ gName: gName });
        if (checkGenderExists) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ error: "Gender already exists" });
          });
        } else {
          let newGender = new genderModel({
            gName,
            gDescription,
            gStatus,
            gImage,
          });
          await newGender.save((err) => {
            if (!err) {
              return res.json({ success: "Gender created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditGender(req, res) {
    let { gId, gName, gDescription, gStatus } = req.body;
    if (!gId || !gName || !gDescription || !gStatus) {
      return res.json({ error: "All filled must be required" });
    }
    try {
      let editGender = genderModel.findByIdAndUpdate(gId, {
        gName,
        gDescription,
        gStatus,
        updatedAt: Date.now(),
      });
      let edit = await editGender.exec();
      if (edit) {
        return res.json({ success: "Gender edit successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getDeleteGender(req, res) {
    let { gId } = req.body;
    if (!gId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedGenderFile = await genderModel.findById(gId);
        const filePath = `../server/public/uploads/genders/${deletedGenderFile.gImage}`;

        let deleteGender = await genderModel.findByIdAndDelete(gId);
        if (deleteGender) {
          // Delete Image from tem folder
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Gender deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const genderController = new Gender();
module.exports = genderController;
