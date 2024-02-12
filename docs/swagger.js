const { bearerAuth } = require("./swagger/component/securityScheme");
const rolePath = require("./swagger/path/role");
const userPath = require("./swagger/path/user");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "E-Wallet Backend Nodejs Express",
    description: "Documentation for E-Wallet Backend Nodejs Express by rafialfian10",
    version: "1.0.0",
    license: {
      name: "MIT",
      url: "https://github.com/rafialfian10/https://github.com/rafialfian10/e-wallet-backend-nodejs-express/LICENSE",
    },
    contact: {
      name: "Rafi Alfian",
      email: "rafialfian770@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: bearerAuth,
    },
  },
  paths: { ...rolePath, ...userPath },
};

module.exports = swaggerDefinition;
