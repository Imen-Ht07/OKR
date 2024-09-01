const Employe = require('../models/employe');
const bcrypt = require("bcryptjs");

// Ajout d'un employé
exports.saveEmploye = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newEmploye = new Employe({
    ...req.body,
    photo: req.file.filename,
    password: hashedPassword,
  });

  await newEmploye.save();
  res.status(200).json("Employé ajouté avec succès");
};

// Nombre d'employés
exports.getNombreEmployes = async (req, res) => {
  try {
    const count = await Employe.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des employés :', error);
    res.status(500).json({ message: 'Erreur lors du comptage des employés', error });
  }
};

// Récupérer tous les employés
exports.findAll = async (req, res) => {
      try {
        const { nom } = req.query;
        const query = nom ? { nom: { $regex: new RegExp(nom, 'i') } } : {};
        const employes = await Employe.find(query);
        res.json(employes);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    };
    // Mise à jour d'un employé
    exports.update = async (req, res) => {
      try {
        const updatedEmploye = await Employe.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).send(updatedEmploye);
      } catch (error) {
        console.log(error);
        res.status(500).send('Erreur serveur');
      }
    };
// Suppression d'un employé
exports.delete = (req, res) => {
      Employe.findOneAndDelete({ _id: req.params.id })
        .then(() => res.status(204).json({ message: "Employé supprimé avec succès" }))
        .catch((error) => {
          console.log(error);
          res.status(404).json({ message: "Employé avec l'ID fourni non trouvé" });
        });
    };
    // Récupérer un employé par ID
    exports.getID = (req, res) => {
      Employe.findById({ _id: req.params.id })
        .then((employe) => res.status(200).send(employe))
        .catch((error) => { console.log(error); });
    };
