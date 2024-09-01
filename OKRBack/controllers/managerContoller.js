const Manager = require('../models/manager');
const bcrypt = require("bcryptjs");

// Ajout d'un manager
exports.saveManager = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newManager = new Manager({
    ...req.body,
    photo: req.file.filename,
    password: hashedPassword,
  });

  await newManager.save();
  res.status(200).json("Manager ajouté avec succès");
};

// Obtenir le nombre de managers
exports.getNombreManagers = async (req, res) => {
  try {
    const count = await Manager.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de managers :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de managers' });
  }
};


// Récupérer tous les managers
exports.findAllManagers = async (req, res) => {
  try {
    const { nom } = req.query;
    const query = nom ? { nom: { $regex: new RegExp(nom, 'i') } } : {};
    const managers = await Manager.find(query);
    res.json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mise à jour d'un manager
exports.updateManager = async (req, res) => {
  try {
    const updatedManager = await Manager.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).send(updatedManager);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur serveur');
  }
};

// Suppression d'un manager
exports.deleteManager = (req, res) => {
  Manager.findOneAndDelete({ _id: req.params.id })
    .then(() => res.status(204).json({ message: "Manager supprimé avec succès" }))
    .catch((error) => {
      console.log(error);
      res.status(404).json({ message: "Manager avec l'ID fourni non trouvé" });
    });
};

// Récupérer un manager par ID
exports.getManagerByID = (req, res) => {
  Manager.findById({ _id: req.params.id })
    .then((manager) => res.status(200).send(manager))
    .catch((error) => { console.log(error); });
};
