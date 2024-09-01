const express = require('express');
const router = express.Router();
const resultatController = require('../controllers/resultatController');


// Créer un résultat lié à un objectif
router.post('/:objectifID/createResultat', resultatController.createResultat);

// Obtenir tous les résultats pour un objectif spécifique
router.get('/:objectifID/resultats', resultatController.getAllResultats);
// Obtenir tous les résultats pour un objectif spécifique
router.get('/resultats', resultatController.getAll);
// Obtenir un résultat spécifique par son ID
router.get('/resultatByID/:id', resultatController.getResultatById);

// Supprimer un résultat spécifique
router.delete('/deleteresultat/:id', resultatController.deleteResultat);

// Modifier un résultat spécifique
router.put('/Updateresultat/:id', resultatController.updateResultat);
// obtenir le nombre  resultat
router.get('/countResult',resultatController.getResultCountByStatus);

module.exports = router;
