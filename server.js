const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const db = require('./models');
const uploadRouter = require('./routes/upload');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello valueGa!' });
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/upload', uploadRouter);

server.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
