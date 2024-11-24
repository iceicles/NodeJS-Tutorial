const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('-name, price');
  // we can use the pkg 'express-async-errors' to throw errors for routes.
  // no need to call next() function provided by express to call middleware with err msgs
  // throw new Error('testing async errors');
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // in for ex., /api/v1/products?featured=true, featured=true is req.query
  const { featured, company, name, sort, fields } = req.query; // pull out only what we need
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    // see mongoDB docs: https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex
    queryObject.name = { $regex: name, $options: 'i' };
  }

  let result = Product.find(queryObject);

  // sort
  if (sort) {
    const sortList = sort.split(',').join(' '); // sort values => name,-price becomes name price as is the req format
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt'); // sort by time resource is created
  }

  // fields
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList); // selects only the fields you want to view or exclude (see docs)
    console.log(fields);
  }

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
