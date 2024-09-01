const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String},
  start: { type: String },
  end: { type: String }
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;