// routes/teamRoutes.js

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Routes pour les opérations sur les équipes
router.post('/addteam', teamController.createTeam);
router.get('/getteam', teamController.getTeams);
router.get('/getteambyid/:id', teamController.getTeamById);
router.put('/:managerId/:employeeIds/updateteam/:id', teamController.updateTeam);
router.delete('/deleteteam/:id', teamController.deleteTeam);

module.exports = router;
