const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

/* GET home page */
router.get('/signup', (req, res) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(500).render('auth/signup.hbs', {
      errorMessage: 'Please enter email, username and password'
    });
    return;
  }

  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.status(500).render('auth/signup.hbs', {
      errorMessage: 'Invalid Email'
    });
    return;
  }

  re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!re.test(password)) {
    res.status(500).render('auth/signup.hbs', {
      errorMessage: 'Invalid Password: Needs 8 characters, a lowercase and uppercase letter and a number'
    });
    return;
  }

  bcrypt
    .genSalt(12)
    .then(salt => {
      bcrypt
        .hash(password, salt)
        .then(passwordHash => {
          UserModel.create({ username, email, passwordHash })
            .then(() => {
              res.redirect('/profile');
            })
            .catch(err => {
              if (err.code === 11000) {
                if (err.keyValue.username) {
                  res.status(500).render('auth/signup.hbs', {
                    errorMessage: 'Username is taken',
                    email,
                    username
                  });
                }
                else if (err.keyValue.email) {
                  res.status(500).render('auth/signup.hbs', {
                    errorMessage: 'Email is taken',
                    email,
                    username
                  });
                }
              } else {
                res.status(500).render('auth/signup.hbs', {
                  errorMessage: 'Something went wrong!',
                  email,
                  username
                });
              }
              return;
            });
        })
        .catch(() => {
          console.log('Failed to generate hash');
        });
    })
    .catch(() => {
      console.log('Failed to generate salt');
    });
});

router.get('/signin', (req, res) => {
  res.render('auth/signin.hbs');
});

router.post('/signin', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.status(500).render('auth/signin.hbs', {
      errorMessage: 'Please enter email and password'
    });
    return;
  }

  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.status(500).render('auth/signin.hbs', {
      errorMessage: 'Invalid Email'
    });
    return;
  }

  UserModel.findOne({email})
  .then((userData) => {
    console.log(userData);

    bcrypt.compare(password, userData.passwordHash)
    .then((matches) => {
      if(matches) {
        res.redirect('/profile');
      } else {
        res.status(500).render('auth/signin.hbs', {
          errorMessage: 'Incorrect Password'
        });
      }
    })
    .catch((res) => {
      res.status(500).render('auth/signin.hbs', {
        errorMessage: 'Something went wrong!',
      });
      return;
    });
  })
  .catch(() => {
    res.status(500).render('auth/signin.hbs', {
      errorMessage: 'Something went wrong!',
    });
    return;
  });

});

router.get('/profile', (req, res) => {
  res.render('users/profile.hbs');
});

module.exports = router;
