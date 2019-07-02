require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require ('./models/person')

const app = express()

const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    let time = new Date().toString();
    Date().to
    console.log(time)
    res.send(
        'There is ' + persons.length + ' people</br>'
        + time)


})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })

    //res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    Person.findById(id).then(person => {
        res.json(person)
    })
})

app.post('/api/persons', (req, res) => {

    const name = req.body.name
    const number = req.body.number
    // validating request content is not empty
    console.log (name)
    console.log (number)
    console.log (persons.find(person => person.name === name))
    const validate = (name, number) => {
        if (number === "" || number === undefined) {
            return { error: "number should be passed" }
        } else if (name === "" || name === undefined) {
            return { error: "name should be passed" }
        // } else if (persons.find(person => person.name === name)!=undefined) {
        //     return { error: "name already exists" }
        }
        return null
    }
    
    const val = validate(name, number)
    console.log(val)

    if (val) {
        res.status(400).json(val)
    } else {
        let id = Math.floor(Math.random() * (persons.length + 10 - persons.length + 1) + persons.length);
        console.log(id)

        const person = new Person({ 
            name: name, number: 
            number, 
            id: id
        })

        person.save().then(savedPerson => {
            res.json(savedPerson.toJSON())
        })        
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        persons.splice(id, 1)
        console.log(persons)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})