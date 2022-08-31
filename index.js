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
    const date = new Date()
    console.log(date)
    res.send(`
    Phonebook has info for ${persons.length} people
    ${date.toString()}`
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({})
      .then(persons => {
        res.json(persons)
      })
})

app.get('/api/persons/:id', (req, res) => {
  
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => {
      res.status(404).end()
    })
  /*
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    person ? res.json(person) : res.status(404).end()*/
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const nameExists = persons.some(p => p.name === req.body.name)

    if(!req.body.name || !req.body.number) {
        return res.json({
            error: 'Debe agregar nombre y numero'
        })
    }
    if(nameExists) {
        return res.json({
            error: 'El nombre debe ser unico'
        })
    }
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: idRandom()
    }
    persons = persons.concat(person)
    res.json(person)
})



const idRandom = () => {
    return Math.floor(Math.random() * 1000)
}
const unknownEndPoint = (req, res) => {
    res.status(404).send({error: 'El endpoint no existe'})
}
app.use(unknownEndPoint)
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
