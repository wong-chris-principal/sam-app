const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "e-enrollment api",
      version: "1.0.0",
    },
  },
  apis: ["./invitation/app.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

fs.writeFileSync("swagger.json", JSON.stringify(openapiSpecification));
