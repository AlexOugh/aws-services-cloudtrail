
/*
export TRAIL_NAME=Default
export BUCKET_NAME_POSTFIX=.cloudtrail
export BUCKET_POLICY_NAME=bucket_cloudtrail_policy
*/

const Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
};
const body = {
  "Credentials": Credentials,
  "region": "us-east-1",
  "account": "089476987273"
};

event = {
  "path": "/cloudtrail",
  "httpMethod": "POST",
  "body": JSON.stringify(body)
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
