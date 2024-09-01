const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({

    title: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    resultatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resultat'
      }
});

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action 