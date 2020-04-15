const express = require("express"),
  bodyParser = require("body-parser"),
  mailer = require("./mailer"),
  fs = require("fs"),
  path = require("path"),
  Handlebars = require("handlebars");

const app = express();
const port = process.env.PORT || 5000;

// Open template file
const source = fs.readFileSync(
  path.join(__dirname, "templates/contactForm.hbs"),
  "utf8"
);
// Create email generator
var template = Handlebars.compile(source);

app.use(express.static(path.join(__dirname, '/public')));

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/sendMail", (req, res) => {
  const { body: { name, email, message } = {} } = req;
  if (!email || !message) return res.sendStatus(400);
  const content = {
    from: email,
    to: process.env.EMAIL,
    subject: `New message received${name ? ` from ${name}.` : '.'}`,
    html: template({ email, message, name })
  };
  mailer(content);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => console.log(`server listening at ${port}`));
