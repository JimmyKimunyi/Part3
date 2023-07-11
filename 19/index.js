require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./model/person");
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

const errorHandler = (error, next) => {
  console.log(error);
  next(error);
};

const PORT = process.env.PORT || 3000;

app.get("/api/persons", (_req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
      console.log(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const time = new Date().toString();
  res.send(
    `<p> Phonebook has info for : ${persons.length} <br /> ${time} </p>`
  );
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.staus(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || body.name === "" || !body.number || body.number === "") {
    return res.statusCode(400).json({ error: "Content Missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  Person.find({})
    .then((persons) => {
      res.json(persons);

      const personExists = persons.find((name) => person.name === name.name);
      if (!personExists) {
        person
          .save()
          .then((savedPerson) => {
            res.json(savedPerson);
          })
          .catch((error) => next(error));
      } else {
        const personExistsId = Number(personExists.id);
        Person.findByIdAndUpdate(personExistsId, person, { new: true })
          .then((updatedPerson) => {
            res.json(updatedPerson);
          })
          .catch((error) => {
            console.log(personExistsId);
            console.log(error);
            next(error);
          });
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT} `);
});
