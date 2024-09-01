const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Manager', 
    },
    employees: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employe' 
    }]
});

module.exports = mongoose.model('Team', teamSchema);
