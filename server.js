const express = require('express');
const cors = require('cors');
const app = express();

const articlesRoutes = require('./routes/articles');
const profilesRoutes = require('./routes/profiles');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/articles', articlesRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

app.listen(port, () => {
  console.log(`listening to server ${port}`);
});
