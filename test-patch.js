const axios = require('axios');

async function run() {
  try {
    // We need a valid token. Let's register a temporary user and login.
    const resReg = await axios.post('http://localhost:3000/auth/register', {
      email: 'testpatch@example.com',
      password: 'password',
      displayName: 'Test Patch'
    }).catch(e => e.response);

    let token = resReg?.data?.access_token;
    if (!token) {
       const resLog = await axios.post('http://localhost:3000/auth/login', {
         email: 'testpatch@example.com',
         password: 'password'
       });
       token = resLog.data.access_token;
    }

    const resPatch = await axios.patch('http://localhost:3000/users/profile', {
      fitPreference: 'Tailored',
      budgetProfile: '100-300'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(resPatch.data);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

run();
