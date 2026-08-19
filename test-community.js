const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/sevensense');
  const db = mongoose.connection;
  
  const users = await db.collection('users').find({}).toArray();
  console.log(`Found ${users.length} users`);
  
  for (const user of users) {
    console.log(`User: ${user.email} | ID: ${user._id} | Following: ${user.following}`);
  }

  const posts = await db.collection('posts').find({}).toArray();
  console.log(`Found ${posts.length} posts`);
  
  for (const post of posts) {
    console.log(`Post ID: ${post._id} | UserID: ${post.userId} (Type: ${typeof post.userId}) | caption: ${post.caption}`);
  }
  
  mongoose.disconnect();
}

check().catch(console.error);
