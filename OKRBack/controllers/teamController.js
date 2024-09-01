const Team = require('../models/team');
const Manager = require('../models/manager');
const Employee = require('../models/employe');

exports.createTeam = async (req, res) => {
    try {
        const { name, managerId, employeeIds } = req.body;

        // Vérifier si le manager existe
        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).send({ message: 'Manager not found' });
        }

        // Vérifier si les employés existent
        const employees = await Employee.find({ '_id': { $in: employeeIds } });
        if (employees.length !== employeeIds.length) {
            return res.status(404).send({ message: 'One or more employees not found' });
        }

        // Créer l'équipe
        const newTeam = new Team({
            name,
            manager: managerId,
            employees: employeeIds
        });

        await newTeam.save();
        res.status(201).send(newTeam);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
// Lire toutes les équipes
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('manager employees');
        res.status(200).send(teams);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Lire une équipe par ID
exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('manager employees');
        if (!team) {
            return res.status(404).send({ message: 'Team not found' });
        }
        res.status(200).send(team);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Mettre à jour une équipe
exports.updateTeam = async (req, res) => {
    try {
        const { name, managerId, employeeIds } = req.body;

        // Vérifier si le manager existe
        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).send({ message: 'Manager not found' });
        }

        // Vérifier si les employés existent
        const employees = await Employee.find({ '_id': { $in: employeeIds } });
        if (employees.length !== employeeIds.length) {
            return res.status(404).send({ message: 'One or more employees not found' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            { name, manager: managerId, employees: employeeIds },
            { new: true }
        );

        res.status(200).send(updatedTeam);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Supprimer une équipe
exports.deleteTeam = async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
