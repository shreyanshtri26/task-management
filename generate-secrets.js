const crypto = require('crypto');

// Function to generate a secure random string
const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Generate and log two different secrets
const jwtSecret = generateSecret();
const jwtRefreshSecret = generateSecret();

console.log('\nGenerated Secrets for your .env file:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}\n`);