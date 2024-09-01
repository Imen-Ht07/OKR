const Action = require('../models/action');
const Resultat = require('../models/resultatCle');
const objectif = require('../models/objectif');

const handleErrorResponse = (res, error, message, statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message });
};

const updateEtatAvancement = async (resultatId) => {
  try {
    const resultat = await Resultat.findById(resultatId);

    if (!resultat) {
      throw new Error('Résultat non trouvé');
    }

    let newEtatAvancement;
    if (resultat.avancement === 0) {
      newEtatAvancement = 'Non commencé';
    } else if (resultat.avancement === 100) {
      newEtatAvancement = 'Terminé';
    } else {
      newEtatAvancement = 'En cours';
    }

    if (resultat.etat_avancement !== newEtatAvancement) {
      resultat.etat_avancement = newEtatAvancement;
      await resultat.save();
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état d\'avancement:', error);
  }
};

const updateObjectifAvancement = async (objectifID) => {
  try {
    const resultats = await Resultat.find({objectifID });

    let allFinished = true;
    let allNotStarted = true;
    for (let i = 0; i < resultats.length; i++) {
      if (resultats[i].etat_avancement !== 'Terminé') {
        allFinished = false;
      }
      if (resultats[i].etat_avancement !== 'Non commencé') {
        allNotStarted = false;
      }
    }

    let nouvelEtatAvancement;
    if (allFinished) {
      nouvelEtatAvancement = 'Terminé';
    } else if (allNotStarted) {
      nouvelEtatAvancement = 'Non commencé';
    } else {
      nouvelEtatAvancement = 'En cours';
    }

    const updatedObjectif = await objectif.findByIdAndUpdate(
      objectifID,
      { etat_avancement: nouvelEtatAvancement },
      { new: true }
    );

    if (!updatedObjectif) {
      throw new Error('Objectif non trouvé');
    }

    console.log(`État d'avancement de l'objectif ${objectifID} mis à jour à ${nouvelEtatAvancement}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état d\'avancement de l\'objectif:', error);
  }
};

const updateResultatAvancement = async (resultatId) => {
  try {
    const actions = await Action.find({ resultatId });

    if (actions.length === 0) {
      throw new Error('Aucune action trouvée pour ce résultat');
    }

    const completedActions = actions.filter(action => action.completed).length;
    const newAvancement = (completedActions / actions.length) * 100;

    await Resultat.findByIdAndUpdate(resultatId, { avancement: newAvancement });
    await updateEtatAvancement(resultatId);

    console.log(`L'avancement du résultat ${resultatId} a été mis à jour à ${newAvancement}%`);

    const resultat = await Resultat.findById(resultatId);
    if (resultat) {
      await updateObjectifAvancement(resultat.objectifID);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avancement:', error);
  }
};

exports.createAction = async (req, res) => {
  try {
    const { title, completed } = req.body;
    const resultatId = req.params.resultatId;

    const newAction = new Action({
      title,
      completed,
      resultatId
    });

    const action = await newAction.save();
    res.status(201).json({ message: 'Action créée avec succès', action });
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la création de l\'action');
  }
};
//GETALL
exports.getAllActions = async (req, res) => {
  try {
    const resultatId = req.params.resultatId;
    if (!resultatId) {
      return res.status(400).json({ message: 'Le paramètre resultatId est requis' });
    }

    const actions = await Action.find({ resultatId });
    res.status(200).json(actions);
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la récupération des actions');
  }
};

exports.deleteAction = async (req, res) => {
  try {
    const action = await Action.findByIdAndDelete(req.params.id);
    if (!action) {
      return res.status(404).json({ message: 'Action non trouvée' });
    }
    res.status(200).json({ message: 'Action supprimée avec succès' });
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la suppression de l\'action');
  }
};

exports.updateAction = async (req, res) => {
  try {
    const updatedAction = await Action.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAction) {
      return res.status(404).json({ message: 'Action non trouvée' });
    }
    res.status(200).json({ message: 'Action modifiée avec succès', action: updatedAction });
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la modification de l\'action');
  }
};

exports.getActionById = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: 'Action non trouvée' });
    }
    res.status(200).json(action);
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors de la récupération de l\'action');
  }
};

exports.toggleCompletion = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: 'Action non trouvée' });
    }

    action.completed = !action.completed;

    const updatedAction = await action.save();

    await updateResultatAvancement(action.resultatId);

    res.status(200).json(updatedAction);
  } catch (error) {
    handleErrorResponse(res, error, 'Erreur lors du changement d\'état de complétion de l\'action');
  }
};
