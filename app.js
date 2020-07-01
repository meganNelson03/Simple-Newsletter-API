require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var https = require("https");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var details = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email
  }

  const url = `https://us10.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`;

  const data = {
    members: [
      {
        email_address: details.email,
        status: "subscribed",
        merge_fields: {
          FNAME: details.firstName,
          LNAME: details.lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: `menels:${process.env.API_KEY}`
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

});


app.listen(3000, () => {
  console.log("Listening at Port 3000");
});
