const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/node-api';
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const { connection } = mongoose;

connection.once('open', () => {
  console.log(`${url} database connected`);
}).catch((err) => {
  console.log(`Database error: ${err}`);
});

module.exports = mongoose;
