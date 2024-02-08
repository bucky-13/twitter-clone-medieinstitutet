var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('test');
  console.log()
});

// Create user and login

router.post('/add', (req, res) => {
  
  res.json();
});


module.exports = router;
