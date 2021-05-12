const { DynamoDB } = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;

module.exports.create = async (event) => {
  const body = JSON.parse(event.body);
  const newBook = {
    id: body.id,
    name: body.name,
    pages: body.pages,
    author: body.author,
  };
  console.log("Calling /create", newBook);
  await db
    .put({
      TableName,
      Item: newBook,
    })
    .promise();

  return { statusCode: 200, body: JSON.stringify(newBook) };
};

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
module.exports.list = async (event) => {
  const books = await db
    .scan({
      TableName,
    })
    .promise();
  console.log("Calling /list");
  return { statusCode: 200, body: JSON.stringify(books) };
  // const swaggerContent = fs.readFileSync("index.html").toString();
  // return { statusCode: 200, body: swaggerContent };
};

module.exports.delete = async (event) => {
  await db
    .delete({
      TableName,
      Key: {
        name: event.pathParameters.name,
      },
    })
    .promise();

  return { statusCode: 200 };
};
