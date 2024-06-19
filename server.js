const express = require('express');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output');
const valuationRouter = require('./routes/valuation');
const authRouter = require('./routes/auth').default;
const consensusRouter = require('./routes/consensus');

// const { authenticateJWT } = require("./routes/auth");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello valueGa!' });
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api/auth', authRouter);
app.use('/api/valuation', valuationRouter);
app.use('/consensus', consensusRouter);
// app.use("/api/valuation", authenticateJWT, valuationRouter);

server.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
