// const AWS = require('aws-sdk');

export const handler = async (event: any = {}) : Promise <any> => {
  console.log('event', JSON.stringify(event));
  return { statusCode: 201, body: 'Hello from Lambda!' }
};
