const express = require('express'); 
const router = express.Router(); 
const objectifController = require('../controllers/objectifController'); 
// Ajout d'un objectif
router.post("/:equipeId/add", objectifController.addObjectif); 
 // Sélectionner tous les objectifs
router.get('/objectiflists', objectifController.getAllObjectifs);
   // Mettre à jour un objectif
router.put('/update/:id', objectifController.updateObjectif); 
    // Supprimer un objectif 
router.delete('/delete/:id', objectifController.deleteObjectif); 
    // Sélectionner un objectif par ID
router.get('/ByID/:id', objectifController.getObjectifByID); 
// obtenir le nombre  d'objectifs
router.get('/count', objectifController.getObjectifCountByStatus);

module.exports = router;