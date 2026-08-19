const axios = require('axios');
require('dotenv').config();

async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.AI_API_KEY}`;
    const res = await axios.get(url);
    console.log("Models:", res.data.models.map(m => m.name).join(', '));
  } catch (error) {
    console.error("Error fetching models:", error.response?.data || error.message);
  }
}
test();
