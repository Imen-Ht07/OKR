const Employe = require('../models/employe');
const Manager = require('../models/manager');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const config = require('../_helpers/auth.config');

const expirationTime = 86400; // 24 hours

exports.signin = async (req, res) => {
  try {
    let user = await Admin.findOne({ email: req.body.email });

    if (!user) {
      let manager = await Manager.findOne({ email: req.body.email });

      if (manager) {
        req.role = "Manager";
        bcrypt.compare(req.body.password, manager.password, async function (err, isMatch) {
          if (isMatch && !err) {
            const token = jwt.sign({ _id: manager._id, role: manager.role }, config.secret, {
              expiresIn: expirationTime,
            });
            console.log("token:", token);
            res.cookie("token", token, { maxAge: expirationTime * 1000, httpOnly: true });
            res.json({
              success: true,
              token: token,
              role: "Manager",
              user: manager,
            });
          } else {
            res.send({
              success: false,
              msg: "Authentication failed. Wrong email or password.",
            });
          }
        });
      } else {
        let employe = await Employe.findOne({ email: req.body.email });
        if (!employe) {
          res.send({
            success: false,
            msg: "Authentication failed. Wrong email or password.",
          });
        } else {
          req.role = "Employee";
          bcrypt.compare(req.body.password, employe.password, function (err, isMatch) {
            if (isMatch && !err) {
              const token = jwt.sign({ _id: employe._id, role: employe.role }, config.secret, {
                expiresIn: expirationTime,
              });
              console.log("token:", token)
              res.cookie("token", token, { maxAge: expirationTime * 1000, httpOnly: true });
              res.json({
                success: true,
                token: token,
                role: "Employee",
                user: employe,
              });
            } else {
              res.send({
                success: false,
                msg: "Authentication failed. Wrong email or password.",
              });
            }
          });
        }
      }
    } else {
      req.role = "Admin";
      bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
        if (isMatch && !err) {
          const token = jwt.sign({ _id: user._id, role: user.role },config.secret, {
            expiresIn: expirationTime,
          });
          console.log("token:", token)
          res.cookie("token", token, { maxAge: expirationTime * 1000, httpOnly: true });
          res.json({
            success: true,
            token: token,
            role: "Admin",
            user: user,
          });
        } else {
          res.send({
            success: false,
            msg: "Authentication failed. Wrong email or password.",
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      msg: "Something went wrong. Please try again later.",
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.adminBoard = (req, res) => {
  if (req.role === 'Admin') {
    res.status(200).send("Admin Content.");
  } else {
    res.status(403).send("Access Denied.");
  }
};

exports.employeBoard = (req, res) => {
  if (req.role === 'Employee') {
    res.status(200).send("Employee Content.");
  } else {
    res.status(403).send("Access Denied.");
  }
};

exports.managerBoard = (req, res) => {
  if (req.role === 'Manager') {
    res.status(200).send("Manager Content.");
  } else {
    res.status(403).send("Access Denied.");
  }
};

exports.getCurrentUserProfile = async (req, res) => {
  try {
    if (!req._id || !req.role) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    let user;
    switch (req.role) {
      case "Admin":
        user = await Admin.findById(req._id);
        break;
      case "Employee":
        user = await Employe.findById(req._id);
        break;
      case "Manager":
        user = await Manager.findById(req._id);
        break;
      default:
        return res.status(400).send({ message: "Invalid user role." });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Obtenir un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    let user;
    switch (req.role) {
      case "Admin":
        user = await Admin.findById(req.params.id);
        break;
      case "Employee":
        user = await Employe.findById(req.params.id);
        break;
      case "Manager":
        user = await Manager.findById(req.params.id);
        break;
      default:
        return res.status(400).send({ message: "Invalid user role." });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Mise à jour du mot de passe 
exports.changePassword = async (req, res) => {
  try {
    let user;
    switch (req.role) {
      case "Admin":
        user = await Admin.findById(req.params.id);
        break;
      case "Employe":
        user = await Employe.findById(req.params.id);
        break;
      case "Manager":
        user = await Manager.findById(req.params.id);
        break;
      default:
        return res.status(400).send({ message: "Invalid user role." });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Le mot de passe actuel est incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashPassword;
    await user.save();
    res.json({ msg: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
