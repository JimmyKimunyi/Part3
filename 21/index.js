require("dotenv").config();
const express = require("express");

const Person = require("./model/person");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

const errorHandler = (error, req, res, next) => {
  next(error);
};

const PORT = process.env.PORT || 3001;

app.get("/api/persons", (_req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      res.status(404);
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      res.status(404);
      next(error);
    });
});

app.get("/info", (req, res) => {
  const time = new Date().toString();
  Person.find({}).then((persons) => {
    res.send(
      `<p> Phonebook has info for : ${persons.length} people <br /> ${time} </p>`
    );
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.staus(204).end();
    })
    .catch((error) => {
      res.status(400);
      next(error);
    });
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
          .catch((error) => {
            res.sendStatus(404);
            next(error);
          });
      } else {
        const personExistsId = Number(personExists.id);
        Person.findByIdAndUpdate(personExistsId, person, { new: true })
          .then((updatedPerson) => {
            res.json(updatedPerson);
          })
          .catch((error) => {
            res.status(400);
            next(error);
          });
      }
    })
    .catch((error) => {
      res.status(400);
      next(error);
    });
  return;
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params.id;

  const person = req.body;

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      res.status(400);
      next(error);
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT} `);
});
