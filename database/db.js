const mongoose = require('mongoose');

const url = process.env.LOCALDBURL || process.env.DBURL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const { connection } = mongoose;

connection.once('open', () => {
  console.log(`${url} database connected`);
}).catch((err) => {
  console.log(`Database error: ${err}`);
});

module.exports = mongoose;
