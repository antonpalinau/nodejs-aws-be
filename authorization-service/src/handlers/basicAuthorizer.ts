import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
} from "aws-lambda";

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event,
  context,
  cb
) => {
  console.log("event: ", JSON.stringify(event));

  if (event["type"] !== "TOKEN") {
    cb("Unauthorized");

    return;
  }

  try {
    const { authorizationToken, methodArn } = event;
    const [tokenType, encodedToken] = authorizationToken.split(" ");

    if (tokenType !== "Basic" || !encodedToken) {
      cb("Unauthorized");

      return;
    }

    const [username, password] = Buffer.from(encodedToken, "base64")
      .toString("utf-8")
      .split(":");
    const storedUserPassword = process.env[username];
    const effect =
      storedUserPassword && storedUserPassword === password ? "Allow" : "Deny";
    const policy = generatePolicy(encodedToken, methodArn, effect);

    cb(null, policy);
  } catch (error) {
    cb(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (
  principalId,
  resource,
  effect = "Deny"
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: resource,
    },
  },
});
