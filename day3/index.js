const express = require("express");
const fs = require("fs");
const app = express();
const shortid = require("shortid");
const Joi = require("joi");
app.use(express.json());
console.log("time middleware");
app.use(function (req, res, next) {
  console.log("url", req.url, "method", req.method, "Time:", Date.now());
  next();
});
const data = fs.readFileSync(`../day1/notes.json`, "utf-8");
const DataJson = JSON.parse(data);
const notes = DataJson["notes"];
console.log(DataJson["notes"]);

app.get("/", (req, res) => {
  res.send("Hello ");
});

//get all todos
app.get("/todos", (req, res) => {
  res.send(notes);
});

//get a specific  todo
app.get("/todos/:title", (req, res) => {
  //console.log(req.params.id);
  console.log(req.params.title);
  const note = notes.find((e) => {
    return e.title == req.params.title;
  });
  if (!note) {
    res.status(404).send("not found");
    return;
    //return;
  } else {
    console.log(note);
    res.send(note);
  }
});

//add todo
app.post("/todos", (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    // status: Joi.string(),
  });
  const result = schema.validate(req.body);
  console.log(result);
  if (result.error) {
    res.status(200).send(result.error.details[0].message);
    return;
  }
  const note = {
    id: shortid.generate(),
    status: req.body.status || "todo",
    title: req.body.title,
    description: req.body.description,
  };
  notes.push(note);
  res.send("sucsess");
});

//delete a todo

app.delete("/todos/:id", (req, res) => {
  const note = notes.find((e) => {
    return e.id == req.params.id;
  });
  if (!note) {
    res.status(404).send("not found");
    return;
  } else {
    const index = notes.indexOf(note);
    console.log(index);
    notes.splice(index, 1);
    console.log(notes);
    res.send(notes);
  }
});

//update a todo
app.patch("/todos/:id", (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(2),
    description: Joi.string().min(2),
    // status: Joi.string(),
  });
  const result = schema.validate(req.body);
  console.log(result);
  if (result.error) {
    res.status(200).send(result.error.details[0].message);
    return;
  }
  const note = notes.find((e) => {
    return e.id == req.params.id;
  });
  if (!note) {
    res.status(404).send("not found");
    return;
    //return;
  } else {
    note.title = req.body.title || note.title;
    note.status = req.body.status || note.status;
    note.title = req.body.title || note.title;
    note.description = req.body.description || note.description;
    console.log(note);
    res.send({ message: "update sucsess" });
  }
});
app.listen(5000);
