const { DynamoDB } = require("aws-sdk");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;
const { uuid } = require("uuidv4");

module.exports.create = async (event) => {
  const body = JSON.parse(event.body);
  const newInvitation = {
    id: uuid(),
    code: uuid(),
  };
  console.log("Calling /create invitation", newInvitation);
  await db
    .put({
      TableName,
      Item: newInvitation,
    })
    .promise();

  return { statusCode: 200, body: JSON.stringify(newInvitation) };
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
module.exports.get = async (event) => {
  const id = event.pathParameters ? event.pathParameters.id : null;
  console.log(`Calling /get invitation, id=${id}`);
  if (id) {
    const result = await db
      .get({
        TableName,
        Key: {
          id,
        },
      })
      .promise();

    if (result && result.Item) {
      const url = `http://postman-echo.com/get?code=${result.Item.code}`;
      const qrCodeImage = await new Promise(function (resolve, reject) {
        QRCode.toBuffer(url, function (err, buffer) {
          if (err) {
            reject(err);
          }
          resolve(buffer);
        });
      });

      return {
        statusCode: 200,
        headers: {
          "Content-type": "image/png",
        },
        body: qrCodeImage.toString("base64"),
        isBase64Encoded: true,
      };
    }
    return { statusCode: 200, body: JSON.stringify({}) };
  } else {
    const invitations = await db
      .scan({
        TableName,
      })
      .promise();
    return { statusCode: 200, body: JSON.stringify(invitations) };
  }
};

// module.exports.delete = async (event) => {
//   await db
//     .delete({
//       TableName,
//       Key: {
//         name: event.pathParameters.name,
//       },
//     })
//     .promise();

//   return { statusCode: 200 };
// };
