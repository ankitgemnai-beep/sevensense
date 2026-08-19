const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sevensense');
  const products = mongoose.connection.collection('products');
  const count = await products.countDocuments();
  console.log('Total products in DB:', count);
  const sample = await products.find().limit(3).toArray();
  console.log('Sample:', sample);
  process.exit(0);
}
check();
