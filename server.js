const express = require('express');
const path = require('path');
const fs = require('fs');
const notesDB = require('./db/db.json');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML route for notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// API route for existing notes db.
app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if(err) {
      console.error(err);
    }
    else {
      const parsedNotes = JSON.parse(data);
    };
  });
  res.sendFile(path.join(__dirname, '/db/db.json'))
});

// API route to add a single note.
app.post('/api/notes', (req, res) => {
  const{title, text, id} = req.body;
  if(title && text && id) {
    const newNote = {title, text, id};
    fs.readFile("./db/db.json", 'utf8', (err, data) => {
      if(err) {
        console.error(err);
      }
      else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 4), (err) => {
          if(err){ 
            console.error(err);
          }
        });
      }
    });
    res.status(201).json("Request Sucessfull: New note added.");
  }
  else{
    res.status(500).json('Internal Server Error: Failed to add new note');
  }
});

// API route to delete a single note.
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if(err) {
      console.error(err);
    }
    else {
      const parsedNotes = JSON.parse(data);
      for(let i = 0; i < parsedNotes.length; i++)
        if(parsedNotes[i].id === req.params.id)
          parsedNotes.splice(i, 1);
      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 4), (writeErr) => {
        if(writeErr){ 
          console.error(writeErr);
          res.status(500).json('Internal Server Error: Note not deleted.');
        }
        else {           
          res.status(200).json('Request Successfull: Note deleted.');
        };          
      });
    }
  });

});

// HMTL route to index.html.
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:3001 🚀`)
);
