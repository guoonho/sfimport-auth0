var SF_ADMIN_USERNAME = ""; // specify admin username here (needs api permissions. generic support account should be ready to use support@elasticpath.com)
var SF_ADMIN_PASSWORD = ""; // specify admin password here
var SF_ADMIN_PASSWORD_SECURITY_TOKEN = ""; // If you don't know this, reset your password
var SF_USER_QUERY = "select firstname, lastname, name, username, title, email, accountid from user where isActive = true";
var SF_ACCOUNT_QUERY = "select id, name, type from account where (type = 'Customer' or type = 'Partner' or type = 'Internal' or type = 'Other')";
var accessToken = null;
var instanceUrl = null;
var accountRecords = null;
var accountList = [];
var userList = [];
var output = null;

var sf = require('node-salesforce');
var fs = require('fs');
var async = require('async');

var conn = new sf.Connection({
  loginUrl: 'https://login.salesforce.com'
});

async.series([
  function(callback) {
    conn.login(SF_ADMIN_USERNAME, SF_ADMIN_PASSWORD + SF_ADMIN_PASSWORD_SECURITY_TOKEN, function (err, userInfo) {
      if (err) {return console.error(err);}
      console.log(conn.accessToken);
      accessToken = conn.accessToken;
      callback(null, '1');
    });
  },
  function(callback) {
    conn.query(SF_ACCOUNT_QUERY)
      .on("record", function(record) {
        accountList[record.Id] = [record.Type, record.Name];
      })
      .on("end", function(query) {
        console.log("account:");
        console.log("total in db: " + query.totalSize);
        console.log("total fetched: " + query.totalFetched);
        callback(null, '2');
      })
      .on("error", function(err) {
        console.error(err);
      })
      .run({ autoFetch : true });
  },
  function(callback) {
    conn.query(SF_USER_QUERY)
      .on("record", function(record) {
        var accId = record.AccountId;
        if (accId != null) {
          userList.push({
            "email": record.Email,
            "email_verified": false,
            "app_metadata": {
              "portalRole": accountList[record.AccountId][0],
              "Account": accountList[record.AccountId][1]
            }
          });
        }
      })
      .on("end", function(query) {
        console.log("user:");
        console.log("total in db: " + query.totalSize);
        console.log("total fetched: " + query.totalFetched);
        callback(null, '3');
      })
      .on("error", function(err) {
        console.error(err);
      })
      .run({ autoFetch : true });
  }
],
function(err, results) {
  console.log(userList);
  console.log("Job's done.");
  fs.writeFile(__dirname + "/userlist", JSON.stringify(userList), function(err) {
    if(err) { return console.error(err);}
    console.log("File written");
  });
});
