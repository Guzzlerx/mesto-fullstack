const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors');

const { TOKEN_KEY = 'hidden-key' } = process.env;

function verifyToken(req, res, next) {
  // const { token } = req.cookies;
  // console.log(req.cookies.token);
  const token = req.headers.authorization;
  console.log(req.headers.authorization);

  if (!token) {
    next(new AuthorizationError());
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, TOKEN_KEY);
  } catch (err) {
    next(new AuthorizationError());
  }

  req.user = payload;

  next();
}

module.exports = verifyToken;
