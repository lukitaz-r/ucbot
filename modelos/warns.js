const mongoose = require('mongoose');

const warnings = new mongoose.Schema({
    guildID: {
        type: String,
        required: true,
      },
      userID: {
        type: String,
        required: true,
      },
      warnings: {
        type: Array,
        default: [],
      },
    });

const model = mongoose.model("warnings", warnings);

module.exports = model;
