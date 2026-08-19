const http = require('http');

const data = JSON.stringify({
  products: [
    {
      externalId: 'amazon-1',
      provider: 'amazon',
      category: 'Bottoms',
      brand: "Levi's",
      title: "Men's Original Fit Jeans",
      price: 2999,
      styleTags: ["WARDROBE GAP"],
      images: ["https://m.media-amazon.com/images/I/81xU-mZ151L._AC_UY1100_.jpg"],
      productUrl: "https://www.amazon.in/dp/B082P3V54P/",
      affiliateUrl: "https://www.amazon.in/dp/B082P3V54P/"
    },
    {
      externalId: 'amazon-2',
      provider: 'amazon',
      category: 'Tops',
      brand: "Allen Solly",
      title: "Men Regular Fit Shirt",
      price: 1299,
      styleTags: ["TRENDING"],
      images: ["https://m.media-amazon.com/images/I/71eUwDk8z+L._AC_UY1100_.jpg"],
      productUrl: "https://www.amazon.in/dp/B073R7G6P6/",
      affiliateUrl: "https://www.amazon.in/dp/B073R7G6P6/"
    },
    {
      externalId: 'amazon-3',
      provider: 'amazon',
      category: 'Shoes',
      brand: "Puma",
      title: "Smash V2 Sneakers",
      price: 2499,
      styleTags: ["ESSENTIAL"],
      images: ["https://m.media-amazon.com/images/I/61X-NlQ1zSL._AC_UY1000_.jpg"],
      productUrl: "https://www.amazon.in/dp/B073VCH4KV/",
      affiliateUrl: "https://www.amazon.in/dp/B073VCH4KV/"
    },
    {
      externalId: 'amazon-4',
      provider: 'amazon',
      category: 'Outerwear',
      brand: "H&M",
      title: "Relaxed Fit Hoodie",
      price: 1999,
      styleTags: ["COMFORT"],
      images: ["https://m.media-amazon.com/images/I/61k1bEa-m+L._AC_UY1100_.jpg"],
      productUrl: "https://www.amazon.in/dp/B0CJ5J6QZ7/",
      affiliateUrl: "https://www.amazon.in/dp/B0CJ5J6QZ7/"
    },
    {
      externalId: 'amazon-5',
      provider: 'amazon',
      category: 'Accessories',
      brand: "Casio",
      title: "Vintage Digital Watch",
      price: 1695,
      styleTags: ["ACCESSORY"],
      images: ["https://m.media-amazon.com/images/I/61iVvU+9PBL._AC_UY1100_.jpg"],
      productUrl: "https://www.amazon.in/dp/B000GAYQJ0/",
      affiliateUrl: "https://www.amazon.in/dp/B000GAYQJ0/"
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/shop/seed',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
