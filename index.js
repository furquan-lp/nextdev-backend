const express = require('express');
const fs = require('fs').promises;
const app = express();

let indexHTML;

const readIndexHTML = async (filePath) => {
  try {
    indexHTML = (await fs.readFile(filePath)).toString();
  } catch (e) {
    console.error('Got an error while trying to read index.html: ', e);
    indexHTML = `<!DOCTYPE html><html><body><h1>Couldn't find ${filePath}.
    <br>Reason: ${e.toString()}</h1></body></html>`;
  }
}

readIndexHTML('./index.html');

app.use(express.json());

app.get('/', (req, res) => res.send(indexHTML));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});