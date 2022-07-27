require('dotenv').config();
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('reqbody', req => { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status - :response-time ms :reqbody'));
//app.use(morgan('tiny'));

let persons = require('./data/persons');
const Person = require('./models/person');

const radomNumber = () => Math.round(Math.random() * 100000)

const generateId = () => {

    const idsInUse = persons.map(p => p.id);
    var id; 
    do{
        id = radomNumber();
    }while(idsInUse.includes(id))

    return id
}

const nameAlreadyInUse = (name) =>{
    return persons.find(p => p.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
}


app.get('/', (request, response) => {
    response.send('<h1>Hello to the Phonebook App!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
    `);
})


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.post('/api/persons', (request, response) => {

    const { name, number}= request.body;

    if (!name || !number) {

        const missName = !name ? "Name is Missing" : '';
        const missNumber = !number ? "Number is Missing" : '';
        const and = !name && !number ? ' and ' : '';

        return response.status(400).json({ error : missName + and + missNumber });
    }

    if(nameAlreadyInUse(name)){
        return response.status(400).json({ error : `Names must be unique. '${name}' is already in use.` });
    }
  
    const person = {
      name,
      number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})