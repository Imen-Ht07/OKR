const mongoose = require("mongoose");

// Schéma pour Objectif
const objectifSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date_limite: { type: String, required: true },
  etat_avancement: {
    type: String,
    enum: ['Non commencé', 'En cours', 'Terminé'],
  },
  equipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // Référence à la collection des équipes
    required: true
  }
});
// Export du modèle Objectif
module.exports = mongoose.model("Objectif", objectifSchema);
