const express = require('express');
const Carousel = require('./models/carousel');
require('dotenv').config();
const backendVersion = require('./package.json').version;

const app = express();

app.use(express.json(), express.static('public'));

app.get('/', (request, response) => response.sendFile('index.html', { root: path.join(__dirname, 'public') }));
app.get('/db/carousel', (request, response) => Carousel.find({}).then(carousel => response.send(carousel)));
app.get('/version', (request, response) => response.json({ version: backendVersion }));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});