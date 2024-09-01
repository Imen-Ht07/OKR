// eventsRoutes.js
const express = require('express');
const eventsRoutes = express.Router();
const eventsController = require('../controllers/calendarController');

// Get all calendar events
eventsRoutes.get('/getAllEvents', eventsController.getAllEvents);

// Create a new calendar event
eventsRoutes.post('/addEvent', eventsController.createEvent);

// Update an existing calendar event
eventsRoutes.put('/updEvent/:id', eventsController.updateEvent);

// Delete an existing calendar event
eventsRoutes.delete('/deleteEvent/:id', eventsController.deleteEvent);

module.exports = eventsRoutes;
