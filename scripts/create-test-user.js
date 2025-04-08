const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('yourpassword', 10);
    
    const user = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      status: 'active'
    });

    console.log('Test user created successfully:', {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit();
  }
}

createTestUser();