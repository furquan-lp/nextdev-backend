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
    authSource: '$external');
})();

const carouselSchema = new mongoose.Schema({
  title: String,
  tags: [{ type: String }],
  text: String,
  link: String,
  image: String
});

module.exports = mongoose.model('Carousel', carouselSchema);