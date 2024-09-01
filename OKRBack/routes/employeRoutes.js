const express = require('express');
const router = express.Router();
const multer = require("../multer");
const employeController = require('../controllers/employeController');
// Ajout d'un employé avec une image optionnelle
router.post("/add", multer.upload.single('photo'), employeController.saveEmploye);
// Récupérer tous les employés
router.get('/lists', employeController.findAll);
// Mettre à jour un employé par ID
router.put('/update/:id', employeController.update);
// Supprimer un employé par ID
router.delete('/delete/:id', employeController.delete);
// Récupérer un employé par ID
router.get('/ByID/:id', employeController.getID);
// Compter le nombre d'employés
router.get('/count', employeController.getNombreEmployes);

module.exports = router;
