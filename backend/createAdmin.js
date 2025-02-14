const bcrypt = require('bcrypt');
const User = require('./models/User');
const sequelize = require('./db');

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        
        const hashedPassword = await bcrypt.hash('Admin@123', 10); // Secure hashed password

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created:', admin);
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();



//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM5MTkxMjIzLCJleHAiOjE3MzkxOTQ4MjN9.GQgt4TUjVCNfds1wufIyaldug8Z3T1qGvz3bVOJlq9c