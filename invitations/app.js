const { DynamoDB } = require("aws-sdk");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;
const { uuid } = require("uuidv4");

/**
 * @openapi
 * /invitations:
 *   post:
 *     summary: Create a invitation.
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The invitation ID.
 *                       example: d642fead-55a3-454e-88bf-3188fe467426
 *                     code:
 *                       type: string
 *                       description: The invitatin code.
 *                       example: c9c549b3-71c3-49af-8a22-1a108a43f3fe
 */
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

  return { statusCode: 201, body: JSON.stringify(newInvitation) };
};

/**
 * @openapi
 * /invitations:
 *   get:
 *     summary: Retrieve a qr code which contains the invitation url
 *     description: Retrieve a qr code which contains the invitation url by passing in the id
 *     responses:
 *       200:
 *         description: QR Code image in png.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
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
          "Content-Type": "image/png",
        },
        body: qrCodeImage.toString("base64"),
        isBase64Encoded: true,
      };
    }
  }
  return { statusCode: 200, body: JSON.stringify({}) };
};

module.exports.getAll = async (event) => {
  console.log(`Calling /get all invitations`);
  const invitations = await db
    .scan({
      TableName,
    })
    .promise();
  return { statusCode: 200, body: JSON.stringify(invitations) };
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
