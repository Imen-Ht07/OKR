const mongoose = require('mongoose');
const Role = require("../_helpers/role");
const adminSchema = new mongoose.Schema({
    nom: { type: String },
    prenom: { type: String },
    tel: { type: Number },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.Admin },
  });
module.exports = mongoose.model("Admin", adminSchema);