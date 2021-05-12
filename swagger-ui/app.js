const express = require("express");
const serverless = require("serverless-http");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// var options = {
//   swaggerOptions: {
//     url: process.env.SWAGGER_SPEC_URL,
//   },
// };

const app = express();
// app.use('/api-docs', swaggerUI.serve,
//     swaggerUI.setup(null, options))
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports.handler = serverless(app);
