const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  language: "ko",
});

const options = {
  info: {
    title: "valueGa API docs",
    description: "PDA-4th 금융프로젝트 valueGa API",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
    },
  },
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.js"];

swaggerAutogen(outputFile, endpointsFiles, options);
