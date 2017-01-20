

# Interfaces to Manage Cloudtrail

API Gateway and Lambda Function to Manage the Cloudtrail Services

![aws-services][aws-services-image]

## How To Setup a CodePipeline

Please see here, https://github.com/SungardAS/aws-services-federation#how-to-setup-a-codepipeline

This API interfaces are using Custom Authorizer and currently, we need to hardcode its Lambda Arn and IAM role for Lambda invocation in swagger.yaml

  - securityDefinitions - \<\<Custom Authorizer Name\>\> - authorizerCredentials

    > \<\<arn_of_iam_role_to_invoke_lambda\>\>

  - securityDefinitions - \<\<Custom Authorizer Name\>\> - authorizerUri

    > "arn:aws:apigateway:\<\<region\>\>:lambda:path/2015-03-31/functions/\<\<arn_of_custom_authorizer_lambda\>\>/invocations"

## How To Test Lambda Functions

- $ cd tests
- $ node test_xxx.js

## [![Sungard Availability Services | Labs][labs-logo]][labs-github-url]

This project is maintained by the Labs group at [Sungard Availability
Services](http://sungardas.com)

GitHub: [https://sungardas.github.io](https://sungardas.github.io)

Blog:
[http://blog.sungardas.com/CTOLabs/](http://blog.sungardas.com/CTOLabs/)

[labs-github-url]: https://sungardas.github.io
[labs-logo]: https://raw.githubusercontent.com/SungardAS/repo-assets/master/images/logos/sungardas-labs-logo-small.png
[aws-services-image]: ./docs/images/logo.png?raw=true
