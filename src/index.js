
var baseHandler = require('aws-services-lib/lambda/base_handler.js')

exports.handler = (event, context) => {
  baseHandler.handler(event, context);
}

baseHandler.get = function(params, callback) {

  var AWS = require('aws-sdk');
  var aws_trail = new (require('aws-services-lib/aws/cloudtrail.js'))();

  var trailName = process.env.TRAIL_NAME;

  var input = {
    trailName: trailName
  };
  if (params.region) input['region'] = params.region;
  if (params.Credentials) {
    const creds = JSON.parse(params.Credentials)
    input['creds'] = new AWS.Credentials({
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.SessionToken
    });
  }
  console.log(input)

  function succeeded(input) { callback(null, {result: true}); }
  function failed(input) { callback(null, {result: false}); }
  function errored(err) { callback(err, null); }

  var flows = [
    {func:aws_trail.findTrails, success:aws_trail.isLogging, failure:failed, error:errored},
    {func:aws_trail.isLogging, success:succeeded, failure:failed, error:errored},
  ];
  aws_trail.flows = flows;

  flows[0].func(input);
}

baseHandler.post = function(params, callback) {

  var AWS = require('aws-sdk');
  var aws_bucket = new (require('aws-services-lib/aws/s3bucket.js'))();
  var aws_trail = new (require('aws-services-lib/aws/cloudtrail.js'))();

  var trailName = process.env.TRAIL_NAME;
  var bucketNamePostfix = process.env.BUCKET_NAME_POSTFIX;
  var bucketPolicyName = process.env.BUCKET_POLICY_NAME;

  // http://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-supported-regions.html
  var rootAccounts = {
    "ap-southeast-1": "arn:aws:iam::903692715234:root",
    "eu-west-1": "arn:aws:iam::859597730677:root",
    "sa-east-1": "arn:aws:iam::814480443879:root",
    "ap-northeast-1": "arn:aws:iam::216624486486:root",
    "us-east-1": "arn:aws:iam::086441151436:root",
    "us-west-1": "arn:aws:iam::388731089494:root",
    "ap-southeast-2": "arn:aws:iam::284668455005:root",
    "us-west-2": "arn:aws:iam::113285607260:root",
    "eu-central-1": "arn:aws:iam::035351147821:root",
    "ap-northeast-2": "arn:aws:iam::492519147666:root",
    "ap-south-1": "arn:aws:iam::977081816279:root"
  };

  // find root account id for that region
  var rootAccount = rootAccounts[params.region];
  console.log('root account = ' + rootAccount);
  if (!rootAccount) {
    context.fail("cannot enable the service because no root account is found in region " + params.region, null);
  }

  var bucketName = params.account + bucketNamePostfix + "." + params.region;
  var resources = [
    'arn:aws:s3:::' + bucketName,
    'arn:aws:s3:::' + bucketName + '/AWSLogs/' + params.account + '/*'];

  var fs = require("fs");
  data = fs.readFileSync(__dirname + '/json/' + bucketPolicyName + '.json', {encoding:'utf8'});
  var policyDoc = JSON.parse(data);
  for(var i = 0; i < resources.length; i++) {
    policyDoc.Statement[i].Principal.AWS.push(rootAccount);
    policyDoc.Statement[i].Resource = resources[i];
  }
  policyDoc = JSON.stringify(policyDoc);

  var input = {
    trailName: trailName,
    bucketName: bucketName,
    policyDocument: policyDoc
  };
  //if (params.multiRegion)  input.multiRegion = params.multiRegion;
  if (params.region) input['region'] = params.region;
  if (params.Credentials) input['creds'] = new AWS.Credentials({
    accessKeyId: params.Credentials.AccessKeyId,
    secretAccessKey: params.Credentials.SecretAccessKey,
    sessionToken: params.Credentials.SessionToken
  });

  function succeeded(input) { callback(null, {result: true}); }
  function failed(input) { callback(null, {result: false}); }
  function errored(err) { callback(err, null); }

  var flows = [
    {func:aws_bucket.findBucket, success:aws_trail.findTrails, failure:aws_bucket.createBucket, error:errored},
    {func:aws_bucket.createBucket, success:aws_bucket.addPolicy, failure:failed, error:errored},
    {func:aws_bucket.addPolicy, success:aws_trail.findTrails, failure:failed, error:errored},
    {func:aws_trail.findTrails, success:aws_trail.isLogging, failure:aws_trail.createTrail, error:errored},
    {func:aws_trail.createTrail, success:aws_trail.startLogging, failure:failed, error:errored},
    {func:aws_trail.isLogging, success:succeeded, failure:aws_trail.startLogging, error:errored},
    {func:aws_trail.startLogging, success:succeeded, failure:failed, error:errored},
  ];
  aws_bucket.flows = flows;
  aws_trail.flows = flows;

  flows[0].func(input);
}

baseHandler.delete = function(params, callback) {

  var AWS = require('aws-sdk');
  var aws_trail = new (require('aws-services-lib/aws/cloudtrail.js'))();

  var trailName = process.env.TRAIL_NAME;

  var input = {
    trailName: trailName
  };
  if (params.region) input['region'] = params.region;
  if (params.Credentials) input['creds'] = new AWS.Credentials({
    accessKeyId: params.Credentials.AccessKeyId,
    secretAccessKey: params.Credentials.SecretAccessKey,
    sessionToken: params.Credentials.SessionToken
  });

  function succeeded(input) { callback(null, {result: true}); }
  function failed(input) { callback(null, {result: false}); }
  function errored(err) { callback(err, null); }

  var flows = [
    {func:aws_trail.findTrails, success:aws_trail.isLogging, failure:succeeded, error:errored},
    {func:aws_trail.isLogging, success:aws_trail.stopLogging, failure:aws_trail.deleteTrail, error:errored},
    {func:aws_trail.stopLogging, success:aws_trail.deleteTrail, failure:failed, error:errored},
    {func:aws_trail.deleteTrail, success:succeeded, failure:failed, error:errored},
  ];
  aws_trail.flows = flows;

  flows[0].func(input);
}
