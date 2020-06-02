const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

/* GET home page */
router.get('/signup', (req, res) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res) => {
  const {username, email, password} = req.body;
  console.log(username, email, password);

  bcrypt.genSalt(12)
  .then((salt) => {
    bcrypt.hash(password, salt)
    .then((passwordHash) => {
      UserModel.create({username, email, passwordHash})
      .then(() => {
        res.send('get the data');
      })
      .catch(() => {
        console.log('Failed to add user data to database');
      })
    })
    .catch(() => {
      console.log('Failed to generate hash');
    });
  })
  .catch(() => {
    console.log('Failed to generate salt');
  });

  res.send('got data');
});

module.exports = router;
