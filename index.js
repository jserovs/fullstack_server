require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require('./models/person')

const app = express()

const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cors())
app.use(express.static('build'))

const validate = (name, number) => {
  if (number === '' || number === undefined) {
    return { error: 'number should be passed' }
  } else if (name === '' || name === undefined) {
    return { error: 'name should be passed' }
  }
  return null
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const time = new Date().toString()
  console.log(time)
  Person.find({}).then(persons => {
    res.send('There is ' + persons.length + ' people</br>' +
            time)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id)

  console.log('searching for subscription with id =' + id)
  Person.find({ id: id })
    .then(person => {
      if (person.length > 0) {
        res.json(person)
      } else {
        console.log("didn't find")
        res.status(404).end()
      }
    })
  // .catch(error => {
  //     console.log(error);
  //     res.status(500).end();
  // })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  console.log('request:' + req.body)
  const name = req.body.name
  const number = req.body.number

  const val = validate(name, number)
  if (val) {
    res.status(400).json(val)
  }

  Person.find({}).then(persons => {
    console.log('Search with same name: ' + name)

    console.log()

    if (persons.find(person => person.name === name)) {
      res.status(400).send({ error: 'already exists, use PUT to update' })
    } else {
      const idNew = Math.max.apply(Math, persons.map((current) => current.id))
      console.log('id for new record: ' + idNew + 1)

      const person = new Person({
        name: name,
        number: number,
        id: idNew + 1
      })

      person.save()
        .then(savedPerson => {
          res.json(savedPerson.toJSON())
        })
        .catch(error => {
          console.log(error)
          res.status(500).end()
        })
    }
  })
})

app.put('/api/persons', (req, res) => {
  console.log('request:' + JSON.stringify(req.body))
  const name = req.body.name
  const number = req.body.number

  const val = validate(name, number)
  if (val) {
    res.status(400).json(val).end()
  }

  const filter = { name: name }
  const update = { number: number }

  Person.findOneAndUpdate(filter, update, { new: true })
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        console.log("didn't find")
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })

  // console.log("found person: " + person);
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  Person.find({ id: id })
    .then(person => {
      if (person.length > 0) {
        console.log(person)
      } else {
        res.status(404).end()
      }
    })
  Person.deleteOne({ id: id })
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
})

const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  console.error(error.message)

  if (error.name === 'NOT_FOUND') {
    return response.status(404).send({ error: 'not found' })
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else {
    return response.status(500).send({ error: 'SOMETHING WENT WRONG' })
  }
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
