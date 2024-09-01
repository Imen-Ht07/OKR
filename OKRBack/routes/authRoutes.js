const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signin', authController.signin);
router.get('/signout', authController.signout);
router.get('/all', authController.allAccess);
router.get('/admin', authController.adminBoard);
router.get('/employe', authController.employeBoard);
router.get('/manager', authController.managerBoard);
router.get('/user', authController.getCurrentUserProfile);
router.get('/user/:id', authController.getUserById); 
router.put('/change-password/:id', authController.changePassword); 
module.exports = router;