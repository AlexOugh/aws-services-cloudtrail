
/*
export TRAIL_NAME=Default
*/

const Credentials = {
  "AccessKeyId": "",
  "SecretAccessKey": "",
  "SessionToken": ""
};
const querystr = {
  "Credentials": JSON.stringify(Credentials),
  "region": "us-east-1"
};

// when sending this querystring in urls
// cloudtrail?region=us-east-1&Credentials=encodeURIComponent(JSON.stringify(Credentials))

event = {
  "path": "/cloudtrail",
  "httpMethod": "GET",
  "queryStringParameters": querystr,
}

var i = require('../src/index.js');
var context = {succeed: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
