const mongoose = require('mongoose')

const boatCountSchema = new mongoose.Schema({
  nameList: {
    type: Array,
    required: true
  },
  boatCount:{
      type: Array,
      required:true
  }
})

module.exports = mongoose.model('boatCount', boatCountSchema)