const userModel = require("../models/user_model");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {
  validateForm,
  validateLogin,
  verifyEmail,
  newPassword,
  resetPassword
} = require("../validation/userValidation");
const jwt = require("jsonwebtoken");
const { logger } = require("../logger/logger");
const { sendOTP } = require("../services/mail");

var otp = Math.floor(100000 + Math.random() * 900000);

exports.register = (req, res) => {
  return res.render("register", {
    values: req.body,
  });
};

exports.authRegister = async (req, res) => {
  try {
    const { error } = validateForm(req.body);
    console.log(error);
    if (error) {
      if (error.details[0].context.key == "name") {
        var err1 = error.details[0].message;
        res.render("register", {
          error1: err1,
          values: req.body,
        });
      }

      if (error.details[0].context.key == "email") {
        var err1 = error.details[0].message;
        res.render("register", {
          error2: err1,
          values: req.body,
        });
      }

      if (error.details[0].context.key == "gen") {
        var err1 = error.details[0].message;
        res.render("register", {
          error3: err1,
          values: req.body,
        });
      }
      if (error.details[0].context.key == "phoneno") {
        var err1 = error.details[0].message;
        res.render("register", {
          error4: err1,
          values: req.body,
        });
      }
      if (error.details[0].context.key == "password") {
        var err1 = error.details[0].message;
        res.render("register", {
          error5: err1,
          values: req.body,
        });
      }
      if (error.details[0].context.key == "pwdRe") {
        var err1 = error.details[0].message;
        res.render("register", {
          error6: err1,
          values: req.body,
        });
      }
    } else {
      console.log("req.body", req.body);

      let user = await userModel.findOne({ email: req.body.email });
      if (user) {
        var err1 = "User Already Register";
        return res.render("register", {
          error: err1,
          values: req.body,
        });
      }
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      const data = {
        name: req.body.name,
        email: req.body.email,
        gen: req.body.gen,
        phoneno: req.body.phoneno,
        password: req.body.password,
        uploadImage: req.file.uploadImage,
        city: req.body.city,
      };
      const userData = new userModel(data);
      userData.save().then((data) => {
        res.redirect("/");
      });
    }
  } catch (err) {
    logger.error("Error", err);
  }
};

exports.login = (req, res) => {
  return res.render("login", {
    values: req.body,
  });
};

exports.authlogin = async (req, res) => {
  const { error } = validateLogin(req.body);
  console.log(req.body);

  if (error) {
    if (error.details[0].context.key == "email") {
      var err1 = error.details[0].message;
      res.render("login", {
        error1: err1,
        values: req.body,
      });
    }
    if (error.details[0].context.key == "password") {
      var err2 = error.details[0].message;
      res.render("login", {
        error2: err2,
        values: req.body,
      });
    }
  } else {
    let user = await userModel.findOne({ email: req.body.email });
    // try{
    if (user) {
      // console.log(user);

      const password = req.body.password;
      const validPassword = await bcrypt.compare(password, user.password);
      console.log(validPassword);
      if (validPassword) {
        res.render("index");
      } else {
        var err1 = "Password does not match";
        return res.render("login", {
          error: err1,
          values: req.body,
        });
      }
    } else {
      var err1 = "User is not found";
      return res.render("login", {
        error: err1,
        values: req.body,
      });
    }
    // }catch (err){
    //     logger.error('Error',err);
  }
};

exports.forgetPass = (req, res) => {
  return res.render("forgetPass", {
    values: req.body,
  });
};
exports.verifyEmail = async (req, res) => {
  try {
    const { error } = verifyEmail(req.body);

    if (error) {
      if (error.details[0].context.key == "email") {
        var err1 = error.details[0].message;
        res.render("forgetpass", {
          error1: err1,
        });
      }
    } else {
      let user = await userModel.findOne({ email: req.body.email });
      console.log(req.body);

      if (user) {
        sendOTP(req.body.email, otp);
        res.render("otp", {
          email: req.body.email,
        });
      } else {
        var err1 = "User is not found";
        return res.render("forgetPass", {
          error: err1,
          email: req.body.email,
        });
      }
    }
  } catch (err) {
    logger.error("error", err);
  }
};

exports.otp = (req, res) => {
  return res.render("otp", {
    email: req.body.email,
  });
};

exports.verifyOtp = (req, res) => {
  try {
    if (otp == req.body.otp) {
      console.log("req.body.email OTP", req.body.email);
      res.render("updatePassword", {
        email: req.body.email,
      });
    } else {
      var err = "Please enter valid OTP";
      return res.render("otp", {
        error: err,
        email: req.body.email,
      });
    }
  } catch (err) {
    logger.error("Error", err);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { error } = newPassword(req.body);
    if (error) {
      if (error.details[0].context.key == "password") {
        var err1 = error.details[0].message;
        res.render("updatePassword", {
          error1: err1,
          email: req.body.email,
        });
      }

      if (error.details[0].context.key == "confirmpassword") {
        var err2 = error.details[0].message;
        res.render("updatePassword", {
          error2: err2,
          email: req.body.email,
        });
      }
    } else {
      console.log(req.body);

      const salt = 10;
      const bcryptPassword = await bcrypt.hash(req.body.password, salt);

      const passwordUpdate = { password: bcryptPassword };

      userModel.updateOne(
        { email: req.body.email },
        passwordUpdate,
        (err, response) => {
          if (response) {
            res.redirect("/");
          } else {
            logger.error(err);
          }
        }
      );
    }
  } catch (err) {
    console.error("Error", err);
  }
};
exports.resetPassword = (req, res) => {
  res.render("resetPassword", {
    email: req.body.email,
  });
};

exports.newPassword = async (req, res) => {
  console.log(req.body);
  try {
    const { error } = resetPassword(req.body);

    if (error) {
      if (error.details[0].context.key == "currentpassword") {
        var err1 = error.details[0].message;
        res.render("resetPassword", {
          error1: err1,
        });
      }

      if (error.details[0].context.key == "newpassword") {
        var err2 = error.details[0].message;
        res.render("resetPassword", {
          error2: err2,
        });
      }

      if (error.details[0].context.key == "confirmpassword") {
        var err3 = error.details[0].message;
        res.render("resetPassword", {
          error3: err3,
        });
      }
    } else {
      const email = req.user.email;
      const user = await userModel.findOne({ email });
      if (user) {
        const passwordValid = await bcrypt.compare(
          req.body.currentpassword,
          user.password
        );

        if (passwordValid) {
          const salt = 10;
          const bcryptPassword = await bcrypt.hash(req.body.newpassword, salt);

          const passwordUpdate = { password: bcryptPassword };

          userModel.updateOne(
            { email },
            passwordUpdate,
            async (err, response) => {
              if (response) {
                console.log("response", response);
                res.redirect("/");
              } else {
                logger.log(err);
              }
            }
          );
        } else {
          return res.render("resetPassword", {
            error: "Current Password is incorrect",
          });
        }
      }
    }
  } catch (err) {
    logger.error(err);
  }
};
exports.index = (req, res) => {
  res.render("index");
};
exports.viewProfile = async (req, res) => {
  const email = req.user.email;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.render("profile", {
        values: user,
      });
    }
  } catch (err) {
    logger.error(err);
  }
};
exports.updateProfile = async (req, res) => {
  const email = req.user.email;

  userModel.findOne({ email: email }, (err, tdata) => {
    if (err) {
      logger.error(err);
    } else {
      res.render("editprofile", {
        user: tdata,
      });
    }
  });
};

exports.editProfile = async (req, res) => {
  const email = req.user.email;
  let new_image = "";
  if (req.file) {
      new_image = req.file.filename;
      try {
          fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
          logger.error(err);
      }
  }
  else {
      new_image = req.body.old_image;
  }
  userModel.findOneAndUpdate({ email: email }, {
      name: req.body.name,
      email: req.body.email,
      gen: req.body.gen,
      phoneno: req.body.phoneno,
      password: req.body.password,
      uploadImage: new_image,
      city: req.body.city
  }, (err, result) => {
      if (err) {
          res.render('editProfile', {
              user: req.body,
              error: err,
          });
      } else {
          res.redirect("/profile")
      }
  })
}

// exports.editProfile = async (req, res) => {
//   try {
//     let { error } = profileValidate(req.body);
//     console.log("error", error);
//     if (error) {
//       // console.log("error", error);
//       if (error.details[0].context.key == "name") {
//         var err1 = error.details[0].message;
//         return res.render("editProfile", {
//           error1: err1,
//           values: req.body,
//         });
//       }
//       if (error.details[0].context.key == "email") {
//         var err1 = error.details[0].message;
//         return res.render("editProfile", {
//           error2: err1,
//           values: req.body,
//         });
//       }
//       if (error.details[0].context.key == "gen") {
//         var err1 = error.details[0].message;
//         return res.render("editProfile", {
//           error3: err1,
//           values: req.body,
//         });
//       }
//       if (error.details[0].context.key == "phoneno") {
//         var err1 = error.details[0].message;
//         return res.render("editProfile", {
//           error4: err1,
//           values: req.body,
//         });
//       }
//       if (error.details[0].context.key == "city") {
//         var err1 = error.details[0].message;
//         return res.render("editProfile", {
//           error5: err1,
//           values: req.body,
//         });
//       }
//     } else {
//       const user = {
//         name: req.body.name,
//         email: req.body.email,
//         gen: req.body.gen,
//         city: req.body.city,
//         phoneno: req.body.phoneno,
//       };
//       if (req.file === undefined) {
//         user.image = req.body.old_image;
//       } else {
//         user.image = req.file.filename;
//       }
//       // console.log("user====>", user);
//       const updateUser = await userModel.updateOne(
//         { email: req.user.email },
//         user
//       );
//       if (updateUser) {
//         res.redirect("/profile");
//       } else {
//         return res.render("editProfile", {
//           error: "user details updation failed",
//           values: user,
//         });
//       }
//     }
//   } catch (err) {
//     logger.error("err", err);
//     console.log(err);
//     // next(new Error("user details updation failed"));
//   }
// };

exports.logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.redirect("/");
  } catch (err) {
    logger.error(err);
  }
};
