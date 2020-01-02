

const express = require("express");
const router = require("express").Router();
const path = require("path");

const fs = require("fs");
const store = require("./db/store");


const app = express();
const PORT = process.env.PORT || 3000;
const db = path.join(__dirname, "./db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//GET

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html" ));
})

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html" ));
})

app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;
      return res.json(JSON.parse(data));
    });
  });



router.get("/notes", function(req, res) {
    store.getNotes()
    .then(notes => res.json(notes))
    .catch(err => res.status(500).json(err))
})

router.post("/notes", function(req, res){
    store.addNotes(req.body)
    .then(note => res.json(note))
    .catch(err => res.status(500).json(err))
})

router.delete("/notes/:id", function(req, res) {
    store.removeNotes(req.params.id)
    .then(()=>res.json({ok:true}))
    .catch(err => res.status(500).json(err))
})


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });