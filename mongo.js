const mongoose = require('mongoose')


const PersonModel = () => {

  const password = process.argv[2]
  const url = `mongodb+srv://costeira:${password}@cluster0.thdwq.mongodb.net/?retryWrites=true&w=majority`

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
    
  return ({ url , Person : mongoose.model('Person', personSchema) })
}

const showContacts = () =>{
  const { Person } = PersonModel()
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

}

const addContact = () =>{

  const name = process.argv[3]
  const number = process.argv[4]

  const { url,Person } = PersonModel()

  mongoose
    .connect(url)
    .then(() => {

      console.log('connected')
      const person = new Person({ name, number })
  
      return person.save()
    })
    .then(() => {
      console.log('person saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}


switch(true){

case(process.argv.length === 3):
  showContacts()
  break
case(process.argv.length === 5):
  addContact()
  break
default:
  console.log(`
            Wrong parameters provided.
            Please provide a password to see the collection and/or an additional 
            username and contact to add a new contact
            Ex: node mongo.js <password> <name> <password>
            `)
  break
}