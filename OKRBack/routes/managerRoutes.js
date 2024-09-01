const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerContoller');
const multer = require("../multer");
// Route pour ajouter un nouveau manager
router.post('/add', multer.upload.single('photo'),managerController.saveManager);
// Route pour obtenir le nombre total de managers
router.get('/count', managerController.getNombreManagers);

// Route pour récupérer tous les managers (avec recherche optionnelle par nom)
router.get('/lists', managerController.findAllManagers);

// Route pour mettre à jour les informations d'un manager
router.put('/update/:id', managerController.updateManager);

// Route pour supprimer un manager
router.delete('/delete/:id', managerController.deleteManager);

// Route pour récupérer un manager par son ID
router.get('/ByID/:id', managerController.getManagerByID);

module.exports = router;
