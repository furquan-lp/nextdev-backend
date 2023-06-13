const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
const cert = process.env.X509_CERT;

(async () => {
  await mongoose.connect(url, {
    sslValidate: true,
    tlsCertificateKeyFile: cert,
    authMechanism: 'MONGODB-X509',
    authSource: '$external'
  }).catch(e => console.error('Error connecting to the Atlas backend.', e));
})();

const carouselSchema = new mongoose.Schema({
  title: String,
  tags: [{ type: String }],
  text: String,
  link: String,
  button: String,
  image: String
});

carouselSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Carousel', carouselSchema);