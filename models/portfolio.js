const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
const cert = process.env.X509_CERT;

(async () => {
  await mongoose.connect(url, {
    tlsAllowInvalidCertificates: false,
    tlsCertificateKeyFile: cert,
    authMechanism: 'MONGODB-X509',
    authSource: '$external'
  }).catch(e => console.error('Error connecting to the Atlas backend.', e));
})();

const portfolioSchema = new mongoose.Schema({
  image: String,
  title: String,
  text: String,
  tags: [{
    tech: String,
    text: String,
    color: String
  }],
  repo: String,
  site: String
});

portfolioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);