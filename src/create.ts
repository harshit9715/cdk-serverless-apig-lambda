'use strict';

const signalFxLambdaModule = require('signalfx-lambda');

// const AWS = require('aws-sdk');

// Lambda main function handler
/** 
 * @description Handler is wrapped with signalFX module which works with layer and env vars for pushing logs to signalFX dashboard
 * @argument @type {JSON} @name event @description event taht triggered the lambda function
 * 
 * @link https://github.com/signalfx/lambda-nodejs 
**/

exports.handler = signalFxLambdaModule.asyncWrapper(async (event: any = {}) : Promise <any> => {
  console.log('event', JSON.stringify(event));
  return { statusCode: 201, body: 'Hello from Lambda!' }
});
