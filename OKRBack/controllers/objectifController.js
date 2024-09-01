const Objectif = require("../models/objectif");
const Resultat = require("../models/resultatCle")
// Ajouter un objectif
exports.addObjectif = async (req, res) => {
  try {
    const { description, date_limite, etat_avancement } = req.body;
    const equipeId = req.params.equipeId; 
    const newObjectif = new Objectif({
      description,
      date_limite,
      etat_avancement,
      equipeId
    });

    await newObjectif.save();
    res.status(201).json({
      ok: true,
      objectif: newObjectif,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Erreur lors de l'ajout de l'objectif",
      error: err.message,
    });
  }
};

// Mettre à jour un objectif
exports.updateObjectif = async (req, res) => {
  try {
    const updatedObjectif = await Objectif.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedObjectif) {
      return res.status(404).send("Objectif non trouvé.");
    }

    res.status(200).json({
      message: "Objectif mis à jour avec succès.",
      objectif: updatedObjectif,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'objectif",
      error: error.message,
    });
  }
};

// Supprimer un objectif
exports.deleteObjectif = async (req, res) => {
  try {
    const result = await Objectif.findByIdAndDelete({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Objectif non trouvé.' });
    }
    res.status(200).json({ message: 'Objectif supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'objectif",
      error: error.message,
    });
  }
};

// Récupérer un objectif par ID
exports.getObjectifByID = async (req, res) => {
  try {
    const objectif = await Objectif.findOne({ _id: req.params.id });

    if (!objectif) {
      return res.status(404).json({ message: 'Objectif non trouvé.' });
    }

    res.status(200).json(objectif);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'objectif",
      error: error.message,
    });
  }
};

// Récupérer tous les objectifs
exports.getAllObjectifs = async (req, res) => {
  try {
    const objectifs = await Objectif.find({}).populate('equipeId', 'name');
    res.status(200).json(objectifs);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des objectifs",
      error: error.message,
    });
  }
};

// Compter les objectifs par statut
exports.getObjectifCountByStatus = async (req, res) => {
  try {
    const countByStatus = await Objectif.aggregate([
      {
        $group: {
          _id: "$etat_avancement",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      'Non commencé': 0,
      'En cours': 0,
      'Terminé': 0
    };

    countByStatus.forEach(item => {
      result[item._id] = item.count;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du nombre d'objectifs par statut",
      error: error.message
    });
  }
};
