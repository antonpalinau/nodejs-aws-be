import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "import-service",
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: [
    "serverless-webpack",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    stage: "dev",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: ["arn:aws:s3:::${env:BUCKET}"],
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: ["arn:aws:s3:::${env:BUCKET}/*"],
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: "${cf:product-service-${self:provider.stage}.SQSQueueArn}",
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SQS_URL: "${cf:product-service-${self:provider.stage}.SQSQueueUrl}",
    },
  },
  functions: {
    importProductsFile: {
      handler: "handler.importProductsFile",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
            cors: true,
            authorizer: {
              name: "tokenAuthorizer",
              arn:
                "${cf:authorization-service-${self:provider.stage}.basicAuthorizerArn}",
              resultTtlInSeconds: 0,
              identitySource: "method.request.header.Authorization",
              type: "token",
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: "handler.importFileParser",
      events: [
        {
          s3: {
            bucket: "${env:BUCKET}",
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "uploaded/",
                suffix: "*",
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      GatewayResponseDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'",
          },
          ResponseType: "ACCESS_DENIED",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'",
          },
          ResponseType: "UNAUTHORIZED",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
