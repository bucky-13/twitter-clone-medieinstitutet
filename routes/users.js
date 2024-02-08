const express = require('express');
const router = express.Router();
const CryptoJs = require('crypto-js');
require('dotenv').config();


router.post('/register', async(req, res) => {

    // Encrypt the user's password
    let userPassword = CryptoJs.AES.encrypt(req.body.userPassword, process.env.PASSWORDSECRETKEY).toString();
    
    let clientUserData = ({
        email: req.body.userEmail,
        username: req.body.userName,
        password: userPassword
    });

    // Connect to database's collection
    req.app.locals.db.collection('users').insertOne(clientUserData)
    .then(result => {
        
        let dataToClient = ({
            id: result.insertedId,
            email: clientUserData.username,
            username: clientUserData.username
        });

        res.status(200).json(dataToClient);
    })
    .catch(err => {

        console.error('There was a error creating the user: ', err);
        res.status(500).json({
            message: "Error creating user"
        });
    });
});

router.post('/login', async(req, res) => {

    let clientUserData = ({
        username: req.body.userName,
        password: req.body.userPassword
    });

    // Searching for a specific user
    await req.app.locals.db.collection('users').find({username: clientUserData.username}).toArray()
    .then(result => {
        
        if (result.length > 0) { 

            // Decryptning users password
            let decryptUserPassword = CryptoJs.AES.decrypt(result[0].password, process.env.PASSWORDSECRETKEY);
            let originalUserPassword = decryptUserPassword.toString(CryptoJs.enc.Utf8);
            
            // Checking if the client user password is matching orignal user's password
            if (clientUserData.password === originalUserPassword) {
                
                let dataToClient = ({
                    id: result[0]._id,
                    email: result[0].email,
                    username: result[0].username
                });

                res.status(200).json(dataToClient);
            } else {

                res.status(401).json({
                    message: "The username or password is incorrect"
                });
            }
        } else {

            res.json(404).json({ 
                message: "The username or password is incorrect"
            });
        }
    })
    .catch(err => {

        console.error("There was a error getting user's data: ", err);
        res.json(500).json({
            message: "Error getting user's data"
        });
    });
});

// Deleting all the users
router.delete('/all', (req, res) => {
  req.app.locals.db.collection("users").deleteMany({})
    .then(result => {
      console.log(`${result.deletedCount} users have been deleted from the database.`);
      res.status(200).json({ message: `${result.deletedCount} users have been deleted from the database.` });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Server error - could not delete users.' });
    });
});


module.exports = router;
