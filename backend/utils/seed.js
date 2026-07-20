// Optional: seeds the database with an admin account + sample categories.
// Run with: npm run seed  (make sure MONGO_URI in .env is reachable first)
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const run = async () => {
  await connectDB();

  const adminEmail = 'admin@jobportal.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin created -> email: ${adminEmail} / password: Admin@123`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  const categories = ['Software Engineering', 'Design', 'Marketing', 'Sales', 'Customer Support', 'Finance', 'Human Resources'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const exists = await Category.findOne({ slug });
    if (!exists) await Category.create({ name, slug });
  }
  console.log('Categories seeded.');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
