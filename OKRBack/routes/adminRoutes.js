const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route pour l'ajout d'un admin
router.post('/admin', adminController.saveAdmin);

// Route pour la mise à jour d'un admin
router.put('/admin/:id', adminController.updateAdmin);

// Route pour récupérer un admin par ID
router.get('/admin/:id', adminController.getAdminByID);

module.exports = router;
