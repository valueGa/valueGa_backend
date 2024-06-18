const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const db = require('./models');
const { authenticateJWT, router: authRouter } = require('./routes/auth');

const uploadRouter = require('./routes/upload');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function userMiddleware(req, res, next) {
  // req.user 주입
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    console.log(token);
    jwt.verify(token, SECRET_KEY, (err, user) => {
      req.user = user;
      next();
    });
  }
}
app.use(userMiddleware);

function loginRequired(req, res, next) {
  // login 된 유저만 접근
  if (!req.user) {
    return res.sendStatus(401);
  } else {
    next();
  }
}

function logoutRequired(req, res, next) {
  if (req.user) {
    return res.sendStatus(401);
  } else {
    next();
  }
}

app.use('/api/auth', authRouter);

app.use(authenticateJWT);

app.get('/', (req, res) => {
  res.json({ message: 'Hello valueGa!' });
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/upload', loginRequired, uploadRouter);

server.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
