let data = require('./data');

const express = require('express');
const server = express();
server.get("/json", (req, res) => {
    res.json({ message: "Hello world" });
 });
 server.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
 });
 const port = 4000;

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

server.get("/items", (req, res) => {
    res.json(data);
 });

 server.get("/items/:id", (req, res) => {
    const itemId = req.params.id;
    const item = data.find(_item => _item.id === itemId);
 
    if (item) {
       res.json(item);
    } else {
       res.json({ message: `item ${itemId} doesn't exist`})
    }
 });

 const body_parser = require('body-parser');

// parse JSON (application/json content-type)
server.use(body_parser.json());

server.post("/items", (req, res) => {
    const item = req.body;
    console.log('Adding new item: ', item);
 
    // add new item to array
    data.push(item)
 
    // return updated list
    res.json(data);
 });

 // update an item
server.put("/items/:id", (req, res) => {
    const itemId = req.params.id;
    const item = req.body;
    console.log("Editing item: ", itemId, " to be ", item);
 
    const updatedListItems = [];
    // loop through list to find and replace one item
    data.forEach(oldItem => {
       if (oldItem.id === itemId) {
          updatedListItems.push(item);
       } else {
          updatedListItems.push(oldItem);
       }
    });
 
    // replace old list with new one
    data = updatedListItems;
 
    res.json(data);
 });

 // delete item from list
server.delete("/items/:id", (req, res) => {
    const itemId = req.params.id;
 
    console.log("Delete item with id: ", itemId);
 
    // filter list copy, by excluding item to delete
    const filtered_list = data.filter(item => item.id !== itemId);
 
    // replace old list with new one
    data = filtered_list;
 
    res.json(data);
 });

 // diskdb connection
const db = require('diskdb');
db.connect('./data', ['movies']);

// add first movie
if (!db.movies.find().length) {
   const movie = { id: "tt0110357", name: "The Lion King", genre: "animation" };
   db.movies.save(movie);
}
console.log(db.movies.find());

server.post("/items", (req, res) => {
   const item = req.body;
   console.log('Adding new item: ', item);
   // add new item to db
   db.movies.save(item);
   // return updated list
   res.json(db.movies.find());
});

server.get("/items/:id", (req, res) => {
   const itemId = req.params.id;
   const items = db.movies.find({ id: itemId });
   if (items.length) {
      res.json(items);
   } else {
      res.json({ message: `item ${itemId} doesn't exist` })
   }
});

server.get("/items", (req, res) => {
   res.json(db.movies.find());
});

server.put("/items/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;
   console.log("Editing item: ", itemId, " to be ", item);

   db.movies.update({ id: itemId }, item);

   res.json(db.movies.find());
});

server.delete("/items/:id", (req, res) => {
   const itemId = req.params.id;
   console.log("Delete item with id: ", itemId);

   db.movies.remove({ id: itemId });

   res.json(db.movies.find());
});