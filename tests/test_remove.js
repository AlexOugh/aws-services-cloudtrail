
/*
export TRAIL_NAME=Default
*/

const Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
};
const body = {
  "Credentials": Credentials,
  "region": "us-east-1"
};

event = {
  "path": "/cloudtrail",
  "httpMethod": "DELETE",
  "body": JSON.stringify(body)
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
