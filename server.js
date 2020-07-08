const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

const secretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/verify", function (req, res) {
  if (!("g-recaptcha-response" in req.body)) {
    return res.status(400).json({error: "Invalid recaptcha response"})
  }

  request.post('https://www.recaptcha.net/recaptcha/api/siteverify', {
    formData: {
      secret: secretKey,
      response: req.body["g-recaptcha-response"],
      remoteip: req.connection.remoteAddress,
    }
  }, (error, response, body) => {
    if (error) {
      console.error("Recaptcha Error:", error)
      return res.status(500).json({error: "Unknown server error"})
    }

    if (response.statusCode !== 200) {
      console.log(`Recaptcha response status code: ${response.statusCode}`)
      return res.status(500).json({error: "Unknown server error"})
    }

    if (body.success === false) {
      return res.status(400).json({error: "Failed captcha verification"})
    }

    return res.status(200).json({success: true})
  })

});

const server = app.listen(3000, function (){
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
