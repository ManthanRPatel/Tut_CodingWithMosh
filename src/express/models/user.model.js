const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const CONFIG = require("../config/config");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250,
    unique: true, ///  no duplicate emails
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  isAdmin: Boolean,
  // roles:[],
  // operations:[],
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
//   this.password = hash;
//   next();
// });

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CONFIG.USER_EMAIL,
    pass: CONFIG.USER_PASSWORD,
  },
});

userSchema.methods.generateConfirmEmail = async function () {
  try {
    const confirmEmailToken = jwt.sign(
      { _id: this._id, isAdmin: this.isAdmin },
      config.get("emailPrivateKey"),
      { expiresIn: "1d" }
    );

    const url = `${CONFIG.clientURL}/api/users/confirmation/${confirmEmailToken}`;

    const source = fs.readFileSync(
      path.join(__dirname, "/template/confirmEmail.handlebars"),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(source);

    const options = () => {
      return {
        from: CONFIG.USER_EMAIL,
        to: this.email,
        subject: "Confirm Email",
        html: compiledTemplate({ name: this.name, link: url }),
      };
    };

    await transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("error 1111", error);
        return { status: true, message: error.message };
      } else {
        return { status: true, message: "Email sent successfully!!!" };
      }
    });
  } catch (e) {
    console.log(e);
  }
};


userSchema.methods.generateResetPassEmail = async function (resetToken) {
  try {

    const link = `${CONFIG.clientURL}/passwordReset?token=${resetToken}&id=${this._id}`;

    const source = fs.readFileSync(
      path.join(__dirname, "/template/requestResetPassword.handlebars"),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(source);

    const options = () => {
      return {
        from: CONFIG.USER_EMAIL,
        to: this.email,
        subject: "Password Reset Request",
        html: compiledTemplate({ name: this.name, link: link }),
      };
    };

    await transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("error 1111", error);
        return { status: true, message: error.message };
      } else {
        return { status: true, message: "Email sent successfully!!!" };
      }
    });
  } catch (e) {
    console.log(e);
  }
};

userSchema.methods.generateResetPassSuccessEmail = async function (resetToken) {
  try {

    const source = fs.readFileSync(
      path.join(__dirname, "/template/resetPassword.handlebars"),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(source);

    const options = () => {
      return {
        from: CONFIG.USER_EMAIL,
        to: this.email,
        subject: "Reset Password Successfully",
        html: compiledTemplate({ name: this.name }),
      };
    };

    await transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("error 1111", error);
        return { status: true, message: error.message };
      } else {
        return { status: true, message: "Email sent successfully!!!" };
      }
    });
  } catch (e) {
    console.log(e);
  }
};
/// arrow function

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
