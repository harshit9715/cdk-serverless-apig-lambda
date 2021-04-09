import apigateway = require('@aws-cdk/aws-apigateway'); 
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

export class ApiLambdaStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const createOne = new lambda.Function(this, 'createItemFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'create.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        ITEM_NAME: 'cargo',
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
