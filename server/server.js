const express = require('express');
// destructured import of mongoose.Mongoose object
const {Mongoose} = require('mongoose');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// use express.json instead of body-parser
app.use(express.json());
app.use(cors());
app.use(cookieParser())
const PORT = 3000;

const userRouter = require('./routes/userRouter');
const mediaRouter = require('./routes/mediaRouter')

//Route requests for the users endpoint
app.use('/api/users', userRouter);
app.use('/api/media', mediaRouter);

//  get media profile

//Sends HTML for root domain
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './../index.html'));
});

//Handling bad routes from client
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

//Global error handler
app.use((err, req, res, next) => {

  const defaultError = {
    log: 'Unknown Express middleware error occured',
    status: 500,
    message: {error: 'Oops, something went wrong!'}
  }

  err = Object.assign(defaultError, err);

  console.log(err.log);
  return res.status(err.status).json(err.message);
})

// listen to PORT
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});



