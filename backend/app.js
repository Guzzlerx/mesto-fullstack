require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { usersRouter, cardsRouter } = require('./routes');
const handleError = require('./middlewares/error');
const { NotFoundError } = require('./errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env; // eslint-disable-line

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: [
    'https://guzzlerapp.nomoredomains.sbs',
    'http://guzzlerapp.nomoredomains.sbs',
  ],
  credentials: true,
}));
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorLogger);

app.use('/', (req, res, next) => {
  next(new NotFoundError());
});

app.use(errors());

app.use(handleError);

app.listen(PORT);
