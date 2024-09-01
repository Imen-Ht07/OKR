const Resultat = require('../models/resultatCle');
const Action = require('../models/action')
const handleErrorResponse = (res, error, message, statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

// Créer un résultat
exports.createResultat = async (req, res) => {
  try {
    const { titre, description, avancement, etat_avancement} = req.body;
    const objectifID = req.params.objectifID;
    const newResultat = new Resultat({
      titre, description, avancement, etat_avancement, objectifID
    });

    const resultat = await newResultat.save();
    res.status(201).json({ message: 'Résultat créé avec succès', resultat });
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la création du résultat');
  }
};

// Obtenir tous les résultats
exports.getAllResultats = async (req, res) => {
  try {
    const resultats = await Resultat.find({ objectifID: req.params.objectifID });
    res.status(200).json(resultats);
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la récupération des résultats');
  }
};

// Obtenir tous les résultats
exports.getAll = async (req, res) => {
  try {
    const resultats = await Resultat.find({});
    res.status(200).json(resultats);
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la récupération des résultats');
  }
};

// Supprimer un résultat
exports.deleteResultat = async (req, res) => {
  try {
    const resultat = await Resultat.findByIdAndDelete(req.params.id);
    if (!resultat) {
      return res.status(404).json({ message: 'Résultat non trouvé' });
    }
     // Supprimez les actions associées
     await Action.deleteMany({ resultatId: resultat._id });
    res.status(200).json({ message: 'Résultat supprimé avec succès' });
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la suppression du résultat');
  }
};

// Modifier un résultat
exports.updateResultat = async (req, res) => {
  try {
    const updatedResultat = await Resultat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResultat) {
      return res.status(404).json({ message: 'Résultat non trouvé' });
    }
    res.status(200).json({ message: 'Résultat modifié avec succès', resultat: updatedResultat });
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la modification du résultat');
  }
};

// Obtenir un résultat par son ID
exports.getResultatById = async (req, res) => {
  try {
    const resultat = await Resultat.findById(req.params.id);
    if (!resultat) {
      return res.status(404).json({ message: 'Résultat non trouvé' });
    }
    res.status(200).json(resultat);
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la récupération du résultat');
  }
};
//fonction count
exports.getResultCountByStatus = async (req, res) => {
  try {
    const countByStatus = await Resultat.aggregate([
      {
        $group: {
          _id: "$etat_avancement", // Utilisez le champ correct ici
          count: { $sum: 1 } // Comptez le nombre de documents pour chaque statut
        }
      }
    ]);

    const result = {
      'Non commencé': 0,
      'En cours': 0,
      'Terminé': 0
    };

    countByStatus.forEach(item => {
      if (item._id === 'Non commencé') {
        result['Non commencé'] = item.count;
      } else if (item._id === 'En cours') {
        result['En cours'] = item.count;
      } else if (item._id === 'Terminé') {
        result['Terminé'] = item.count;
      }
    });

    // Envoyer le résultat au client
    res.json(result);
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la récupération du nombre des résultats par statut",
      error: error.message
    });
  }
};
