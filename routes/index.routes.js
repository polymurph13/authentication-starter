const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index', { title: 'Welcome Ironhacker 🚀' }));


router.get('*', (req, res) => res.render('error', { title: 'Page not found. Blame our developer. . .' }));

module.exports = router;
