const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const axios = require('axios');

cloudinary.config({
  cloud_name: 'l3gtvmnx',
  api_key: '394113478569591',
  api_secret: 'vUgmy2mz7ZfDd0MlD-_JUkug5DY'
});

const files = [
  'C:\\Users\\Rishav\\.gemini\\antigravity\\brain\\tempmediaStorage\\media__1787081330313.jpg',
  'C:\\Users\\Rishav\\.gemini\\antigravity\\brain\\tempmediaStorage\\media__1787081330362.jpg',
  'C:\\Users\\Rishav\\.gemini\\antigravity\\brain\\tempmediaStorage\\media__1787081330349.jpg',
  'C:\\Users\\Rishav\\.gemini\\antigravity\\brain\\tempmediaStorage\\media__1787081330331.jpg'
];

async function run() {
  const products = [];
  for (let i = 0; i < files.length; i++) {
    console.log(`Uploading file ${i+1}...`);
    try {
      const result = await cloudinary.uploader.upload(files[i], { folder: 'seven-sense-suggestions' });
      console.log(`Uploaded! URL: ${result.secure_url}`);
      products.push({
        externalId: `suggestion_custom_new_${i}`,
        title: `Curated Outfit ${i+1}`,
        brand: 'Seven Sense Custom',
        price: '4,500',
        image: result.secure_url,
        url: result.secure_url,
        tag: 'PERFECT MATCH'
      });
    } catch(e) {
      console.error(`Upload failed for file ${i+1}:`, e);
    }
  }
  
  try {
    const res = await axios.post('http://localhost:3000/shop/seed', { products });
    console.log('Seed response:', res.data);
  } catch(e) {
    console.error('Seed error:', e.message);
  }
}

run();
