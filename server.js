const fs = require('fs');
const express = require("express");
const path = require("path");



const app = express();
const PORT = process.env.PORT||8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'notes.html'));
});


app.post("/api/notes", (req, res) => {
  const rawdata = fs.readFileSync('./db/db.json', 'utf8');
  const parsedata = JSON.parse(rawdata);
  const newObj = parsedata.concat(req.body);
  const string = JSON.stringify(newObj);
  fs.writeFile('./db/db.json', string, (err)=>{
    if(err) console.log(err);
    res.json(string);
  })
});


app.get('/api/notes', (req,res)=>{
  fs.readFile('./db/db.json','utf8', (err,jsonString)=>{
    if(err) {
      console.log(err);
      return
    };
    res.json(JSON.parse(jsonString))
  })
});


app.delete('/api/notes/:id', (req,res)=>{
  const rawData = fs.readFileSync('./db/db.json', 'utf-8');
  console.log(rawData)
  const parseData = JSON.parse(rawData);
  const {id} = req.params.id;
  console.log(id)
  const newData = parseData.filter(note => note.id !== id);
  console.log(newData)
  fs.writeFile('./db/db.json', JSON.stringify(newData), (err)=>{
    if(err) console.log(err);
    res.json(newData);
  })
});



app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT)});