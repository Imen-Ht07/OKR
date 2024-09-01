
const CalendarEvent = require('../models/calendrier');

// Get all calendar events
const getAllEvents = async (req, res) => {
    try {
      const events = await CalendarEvent.find({});
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving events' });
    }
  };
  
  // Create a new calendar event
  const createEvent = async (req, res) => {
    const eventData = req.body;
    const newEvent = new CalendarEvent(eventData);
    try {
      const event = await newEvent.save();
      res.status(200).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating event' });
    }
  };
  
  // Update an existing calendar event
  const updateEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const eventData = req.body;
    try {
      const event = await CalendarEvent.findByIdAndUpdate(eventId, eventData, { new: true });
      res.status(200).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating event' });
    }
  };
  
  // Delete an existing calendar event
  const deleteEvent = async (req, res) => {
    const eventId = req.params.eventId;
    try {
      await CalendarEvent.findByIdAndDelete(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting event' });
    }
  };
  
  module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };