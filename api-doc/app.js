const fs = require("fs");
// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
module.exports.doc = async (event, context) => {
  try {
    console.log("Calling /api-doc");

    let path = "index.html";
    console.log(`Is ${path} exist?`, fs.existsSync(path));
    path = `${__dirname}/index.html`;
    console.log(`Is ${path} exist?`, fs.existsSync(path));
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `v5 - ${new Date()}`,
        // location: ret.data.trim()
      }),
    };

    response = {
      statusCode: 200,
      body: fs.readFileSync("index.html").toString(),
      headers: { "content-type": "text/html" },
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
