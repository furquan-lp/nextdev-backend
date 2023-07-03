const express = require('express');
const nodemailer = require('nodemailer');
const redis = require('redis');
const promisify = require('util').promisify;
const cors = require('cors');
const Carousel = require('./models/carousel');
const Portfolio = require('./models/portfolio');
require('dotenv').config();
const backendVersion = require('./package.json').version;

const app = express();
const cacheTime = 4 * (1000 * 3600);

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

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
      subject: `NEXTDEV <${name}>: ${subject}`,
      text: content
    };
  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(String(email).toLowerCase())) {
    transporter.sendMail(mail, (err, data) =>
      err ? response.status(400).json({ status: 'fail', error: err }) : response.json({ status: 'success' }));
  } else {
    response.status(400).json({ status: 'fail', error: `malformed email: ${email}` });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});