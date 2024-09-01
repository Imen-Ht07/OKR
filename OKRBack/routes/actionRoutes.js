const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

// Créer un résultat lié à un objectif
router.post('/:resultatId/createAction',actionController.createAction);

// Obtenir tous les résultats pour un objectif spécifique
router.get('/:resultatId/actions', actionController.getAllActions);

// Obtenir un résultat spécifique par son ID
router.get('/actionByID/:id',actionController.getActionById);

// Supprimer un résultat spécifique
router.delete('/deleteaction/:id',actionController.deleteAction);

// Modifier un résultat spécifique
router.put('/Updateaction/:id',actionController.updateAction);

// Route pour changer l'état de complétion d'une action
router.put('/complete/:id', actionController.toggleCompletion);
module.exports = router;

