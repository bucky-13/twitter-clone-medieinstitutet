var express = require('express');
var router = express.Router();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

router.get('/', (req, res) => {
  req.app.locals.db.collection('messages').find().toArray()
  .then((results) => {

    res.json(results);
  });
});

router.post('/add', (req, res) => {
  
  let date = new Date();
  // console.log(typeof date);
  let newMessage = req.body;
  newMessage.datePosted = date
  
  req.app.locals.db.collection('messages').insertOne(newMessage)
  .then((results) => {

    res.json(results);
  });
})

// Find one specific message/post
router.post('/', (req, res) => {  
  const id = new ObjectId(req.body.id);
   
  req.app.locals.db.collection("messages").findOne({ "_id": id })
  .then((message) => {
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: 'Message/post not found' });
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  });
})

//Get all messages from one user
 router.post('/display', (req, res) => {  
 const  user  = req.body.userName; 

  req.app.locals.db.collection("messages").find({ "userName": user }).toArray()
  .then(result => {
    console.log(result);

    let getMessages = [];

    for (const message of result) {
      getMessages.push(message);
    }
    res.status(201).json(getMessages);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Server error - could not get messages' });
  });
})

// Sort message by the date of creation / Less then
router.post('/sortlt', async(req, res) => {
  
  let date = new Date();

  await req.app.locals.db.collection('messages').find({datePosted: {$lt: date}}).toArray()
  .then(result => {
    
    res.status(200).json(result);
  })
  .catch(err => {

    res.status(500).json({
      message: "There was a error sorting the messages"
    })
  })
}); 

// Delete all messages from the database
router.delete('/all', (req, res) => {
  req.app.locals.db.collection("messages").deleteMany({})
    .then(result => {
      console.log(`${result.deletedCount} messages have been deleted from the database.`);
      res.status(200).json({ message: `${result.deletedCount} messages have been deleted from the database.` });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Server error - could not delete messages.' });
    });
});



module.exports = router;
