const mongoose = require('mongoose')

const pairsSchema = new mongoose.Schema({
  name: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  season: {
    type: String,
    required: false,
  },
  0: {
    type: String,
    required: false,
  },
  1: {
    type: String,
    required: false,
  },
  2: {
    type: String,
    required: false,
  },
  3: {
    type: String,
    required: false,
  },
  4: {
    type: String,
    required: false,
  },
  5: {
    type: String,
    required: false,
  },
  6: {
    type: String,
    required: false,
  },
  7: {
    type: String,
    required: false,
  },
  8: {
    type: String,
    required: false,
  },
  9: {
    type: String,
    required: false,
  },
  10: {
    type: String,
    required: false,
  },
  11: {
    type: String,
    required: false,
  },
  12: {
    type: String,
    required: false,
  },
  13: {
    type: String,
    required: false,
  },
  14: {
    type: String,
    required: false,
  },
  15: {
    type: String,
    required: false,
  },
  16: {
    type: String,
    required: false,
  },
  17: {
    type: String,
    required: false,
  },
  18: {
    type: String,
    required: false,
  },
  19: {
    type: String,
    required: false,
  },
  20: {
    type: String,
    required: false,
  },
  21: {
    type: String,
    required: false,
  },
  22: {
    type: String,
    required: false,
  },
  23: {
    type: String,
    required: false,
  },
  24: {
    type: String,
    required: false,
  },
  25: {
    type: String,
    required: false,
  },
  26: {
    type: String,
    required: false,
  },
  27: {
    type: String,
    required: false,
  },
  28: {
    type: String,
    required: false,
  },
  29: {
    type: String,
    required: false,
  },
  30: {
    type: String,
    required: false,
  },
  31: {
    type: String,
    required: false,
  },
  32: {
    type: String,
    required: false,
  },
  33: {
    type: String,
    required: false,
  },
  34: {
    type: String,
    required: false,
  },
  35: {
    type: String,
    required: false,
  },
  36: {
    type: String,
    required: false,
  },
  37: {
    type: String,
    required: false,
  },
  38: {
    type: String,
    required: false,
  },
  39: {
    type: String,
    required: false,
  },
  40: {
    type: String,
    required: false,
  },
  41: {
    type: String,
    required: false,
  },
  42: {
    type: String,
    required: false,
  },
  43: {
    type: String,
    required: false,
  },
  44: {
    type: String,
    required: false,
  },
  45: {
    type: String,
    required: false,
  },
  46: {
    type: String,
    required: false,
  },
  47: {
    type: String,
    required: false,
  },
  48: {
    type: String,
    required: false,
  },
  49: {
    type: String,
    required: false,
  },
  50: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('PairsBackup', pairsSchema)
