require('dotenv').config();
const express =require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const store = require('./store.js');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';
  
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//Grab API key from environment
const API_KEY = process.env.API_KEY;


//Validates API key
function validateBearer(req, res, next) {
  const authVal = req.get('Authorization') || '';
  if(!authVal.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization token not found'});
  }

  const token = authVal.split(' ')[1];
  if (token !== API_KEY) {
    return res.status(401).json({ error: 'Token is invalid'});
  }
  next();
}


//Sends back data when browser looks at /movie endpoint
app.get('/movie', (req, res) => {
  let filtered = [...store];
  let genre = req.query.genre;
  let country = req.query.country;
  let avgScore = parseInt(req.query.avg_vote);

  //checks if genre filter parameter was sent by user and filters original list
  if(genre) {
    filtered = filtered.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  //checks if country filter parameter was sent by user and filters list
  if(country) {
    filtered = filtered.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  //checks if avg_vote parameter was sent by user and filters list
  if(avgScore) {
    filtered = filtered.filter(movie => movie.avg_vote >= avgScore );
  }

  //returns list based on necessary filters, if no filters, returns entire list
  res.json(filtered);
});

app.use(function errorHandler(error, req, res, next){
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;