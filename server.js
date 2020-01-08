

const express = require("express");
const path = require("path");
const uuid = require("uuid");

const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;
const db = path.join(__dirname, "./db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html" ));
})

app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;
      return res.json(JSON.parse(data));
    });
  });

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html" ));
})

 

app.use("/assets/css", express.static(path.join(__dirname,"./public/assets/css")));

app.use("/assets/js", express.static(path.join(__dirname,"./public/assets/js")));

app.use(express.static(path.join(__dirname, "./public")));


app.post("/api/notes", function(req,res) {
    const note = {
        id:uuid.v4(),
        title:req.body.title,
        text:req.body.text
    };

    fs.readFile(db, (err, data) => {
        if(err) throw err;
        const text = JSON.parse(data);
        text.push(note);
        fs.writeFile(db, JSON.stringify(text), err => {
            if (err) throw err;
        });
    });
    res.sendFile(note);
});


app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(db, (err, data) => {
        if (err) throw err;
        const text = JSON.parse(data);
        const newText = text.filter(file => file.id != req.params.id);
        fs.writeFile(db, JSON.stringify(newText), err => {
            if(err) throw err;
        });
    });
    res.sendFile(db);
});


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });