const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.URL_MONGO_DB

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDb ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)