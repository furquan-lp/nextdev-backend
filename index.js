const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const Carousel = require('./models/carousel');
const Portfolio = require('./models/portfolio');
require('dotenv').config();
const backendVersion = require('./package.json').version;

const app = express();
const cacheTime = 4 * (1000 * 3600);

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: process.env.EMAIL_SMTP_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.err(error);
  }
});

app.use(express.json(), express.static('public'));
app.use(cors());

app.get('/', (request, response) => response.sendFile('index.html', {
  root: path.join(__dirname, 'public'),
  maxAge: cacheTime
}));
app.get('/db/carousel', (request, response) => Carousel.find({}).then(carousel => response.send(carousel)));
app.get('/db/portfolio', (request, response) => Portfolio.find({}).then(portfolio => response.send(portfolio)));
app.get('/version', (request, response) => response.json({ version: backendVersion }));

app.post('/mail/send', (request, response) => {
  let name = request.body.name,
    email = request.body.email,
    message = request.body.message,
    subject = request.body.subject,
    content = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    mail = {
      from: name,
      to: process.env.EMAIL_USER,
      subject: `NEXTDEV Message: ${subject}`,
      text: content
    };
  transporter.sendMail(mail, (err, data) =>
    err ? response.status(400).json({ status: 'fail', error: err }) : response.json({ status: 'success' }));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});