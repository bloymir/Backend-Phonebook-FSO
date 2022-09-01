const mongoose = require('mongoose')

if(process.argv.length < 3 ) {
  console.log('Please provide the password as argument: node mongo js <password>')
  process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://bloymir:${password}@cluster0.aisfxgv.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5) {

  const person = new Person({ name, number })

  person.save()
    .then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

if(process.argv.length === 3) {
  console.log('phonebook: ')
  Person.find({})
    .then(persons => {
      persons.map(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
    })
}

