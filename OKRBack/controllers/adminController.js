const Admin = require('../models/admin');
const bcrypt = require("bcryptjs");

// Ajout d'un admin
exports.saveAdmin = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newAdmin = new Admin({
    ...req.body,
    password: hashedPassword,
  });

  await newAdmin.save();
  res.status(200).json("Admin ajouté avec succès");
};

// Mise à jour d'un admin
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).send(updatedAdmin);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur serveur');
  }
};

// Récupérer un admin par ID
exports.getAdminByID = (req, res) => {
  Admin.findById({ _id: req.params.id })
    .then((admin) => res.status(200).send(admin))
    .catch((error) => { console.log(error); });
};
