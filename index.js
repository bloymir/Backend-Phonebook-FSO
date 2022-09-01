require("dotenv").config();
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT ||3001
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan( function (tokens, req, res ){
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

/*let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "juanito",
      "number": "aaaaaa",
      "id": 2
    },
    {
      "name": "jak",
      "number": "kad",
      "id": 4
    },
    {
      "name": "awdwdw",
      "number": "adwda",
      "id": 5
    },
    {
      "name": "adwd",
      "number": "awdadw",
      "id": 6
    },
    {
      "name": "awdw",
      "number": "awd",
      "id": 7
    },
    {
      "name": "fef",
      "number": "sefe",
      "id": 8
    },
    {
      "name": "nelson",
      "number": "aaaaaaa",
      "id": 9
    }
  ]
  */

app.get('/info', (req, res) => {

    Person.estimatedDocumentCount((err, numOfDocument) => {
      if(err) throw(err)
      const date = new Date()
      res.send(`
      Phonebook has info for ${numOfDocument} people
      ${date.toString()}`
      )
    })
    
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
      .then(persons => {
        res.json(persons)
      })
      .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    if(!req.body.name || !req.body.number) {
        return res.json({
            error: 'Debe agregar nombre y numero'
        })
    }
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })
    person.save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const {name, number} = req.body
  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndPoint = (req, res) => {
    res.status(404).send({error: 'El endpoint no existe'})
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({error: 'Malformatted id'})
  } else if (error.name === 'ValidationError'){
    return res.status(406).send({error: error.message})
  }
  next(error)
}
app.use(unknownEndPoint)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
