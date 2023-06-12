const express = require('express');
const Carousel = require('./models/carousel');
require('dotenv').config();

const app = express();

app.use(express.json(), express.static('public'));

app.get('/', (request, response) => response.sendFile('index.html', { root: path.join(__dirname, 'public') }));
app.get('/db/carousel', (request, response) => Carousel.find({}).then(carousel => response.send(carousel)));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});