import apigateway = require('@aws-cdk/aws-apigateway'); 
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

export class ApiLambdaStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
    // GET the layer ARN from SignalFX https://github.com/signalfx/lambda-layer-versions/blob/master/node/NODE.md for the desired region you are deploying to.
    // I have added us-east-1, which is my deployment region

    const signalFX_Layer = lambda.LayerVersion.fromLayerVersionArn(this, 'layerversion', 'arn:aws:lambda:us-east-1:254067382080:layer:signalfx-lambda-nodejs-wrapper:21');

    const createOne = new lambda.Function(this, 'createItemFunction', {
      code: new lambda.AssetCode('src'),
      functionName: 'createItemFunction',
      handler: 'create.handler',
      layers: [signalFX_Layer],
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        ITEM_NAME: 'cargo',

        // SignalFX env vars (I am hard-coding mine, please use process.env.VAR_NAME for adding your values)
        SIGNALFX_ACCESS_TOKEN: process.env.SIGNALFX_ACCESS_TOKEN,
        SIGNALFX_ENDPOINT_URL: process.env.SIGNALFX_ENDPOINT_URL,
        SIGNALFX_METRICS_URL: process.env.SIGNALFX_METRICS_URL,

      }
    });

    const api = new apigateway.RestApi(this, 'cargoAPI', {
      restApiName: 'Cargo Service'
    });

    const items = api.root.addResource('items');

    const createOneIntegration = new apigateway.LambdaIntegration(createOne);
    items.addMethod('POST', createOneIntegration);
    addCorsOptions(items);

  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },  
    }]
  })
}

const app = new cdk.App();
new ApiLambdaStack(app, 'ApiLambdaStack');
app.synth();
