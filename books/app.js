const { DynamoDB } = require("aws-sdk");

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

module.exports.list = async (event) => {
  const books = await db
    .scan({
      TableName,
    })
    .promise();
  console.log("Calling /list");
  return { statusCode: 200, body: JSON.stringify(books) };
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
