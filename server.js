const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output');

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.json({ message: 'Hello valueGa!' });
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
