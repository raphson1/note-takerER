const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const notes = require('./db/db.json')
const {v4: uuidv4} = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('./helpers/fsUtils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.listen(PORT, () =>{
    console.log(`The server is listerning on ${PORT}`)
});

app.get('/api/notes', (req, res) => {
    res.json(notes)
})
app.post('/api/notes', (req, res) => {
    if(req.body){
      const {title, text} = req.body;
      notes.push({"id": uuidv4(), "title": title, "text": text});
      fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if(err){
          console.log(err)
        } else{
          console.log("Note created!!")
        }
      })
      res.status(201).json("Note created succefuly")
    }
  })

  // app.delete('/api/notes/:note_id', (req,res) => {
  //       const noteId = req.params.id;
  //       readFromFile('./db/db.json')
  //       .then((data) => JSON.parse(data))
  //       .then((json) => {
  //           const result = json.filter((note) => note.note_id !== noteId);
  //           writeToFile('./db/db.json', result)
  //           res.json(`note id: ${noteId} has been deleted `)
  //       })
  // })