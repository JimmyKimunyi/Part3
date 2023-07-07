const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("postData", (req, _res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return " - ";
});

app.use(express.json());
app.use(express.static("dist"));
app.use(morgan(" :method :url :status :response-time ms :postData"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const PORT = 3000;

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const selectedPersons = persons.find((person) => person.id === id);
  if (selectedPersons) {
    res.send(selectedPersons);
  } else {
    res.status(404, "Not Found").json({ error: " Not Found " });
  }
});

app.get("/info", (req, res) => {
  const time = new Date().toString();
  res.send(`<p> Phonebook has info for ${persons.length} <br /> ${time} </p>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredPersons = persons.filter((person) => person.id !== id);
  persons = filteredPersons;

  res.status(404).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || body.name === "" || !body.number || body.number === "") {
    return res.send("<p> missing name or number </p>");
  }

  const personExists = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (personExists) {
    return res.send(
      `<p> ${body.name} already exists, name must be unique </p>`
    );
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(persons);

  res.end();
});

const generateId = () => {
  return Math.floor(Math.random() * 100 + 1);
};

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT} `);
});

//
