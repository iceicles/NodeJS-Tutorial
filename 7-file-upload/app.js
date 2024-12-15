require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const fileUpload = require('express-fileupload');

// database
const connectDB = require('./db/connect');

// access files in public folder
app.use(express.static('./public'));

// parsing json from req.body
app.use(express.json());

// adds a files object to the req when files (type='file') are sent
// for example - <input name="foo" type="file" />
app.use(fileUpload());

// product router
const productRouter = require('./routes/productRoutes');
app.use('/api/v1/products', productRouter);

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();