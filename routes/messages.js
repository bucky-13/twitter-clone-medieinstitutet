var express = require('express');
var router = express.Router();

/* GET messages listing. */
router.get('/', (req, res) => {
  res.send('this is messages router');
});

// router.get('/', function (req, res, next) {
//   req.app.locals.db
//     .collection('messages')
//     .find()
//     .toArray()
//     .then((results) => {
//       res.json(results);
//     });
// });


router.post('/', (req, res) => {
  
  const messageIdToFind = req.body.id;

  req.app.locals.db.collection("messages").findOne({ id: messageIdToFind })
    .then(message => {
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



module.exports = router;
