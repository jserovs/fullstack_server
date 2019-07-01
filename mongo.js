const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

console.log(process.argv.length) 

const password = process.argv[2]

const url =
    `mongodb+srv://dbUser:${password}@cluster0-5xwh4.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 2) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        });
        mongoose.connection.close();
    })
}

if (process.argv.length == 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(response => {
        console.log(`${name} number ${number} added to phonebook`);
        mongoose.connection.close();
    })


}





