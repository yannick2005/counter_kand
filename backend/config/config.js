require('dotenv').config({ path: '.env' });

module.exports = {
  "development": {
    "username": process.env.DB_USER || 'postgres',
    "password": process.env.DB_PASSWORD || 'password',
    "database": process.env.DB_NAME || 'database_development',
    "host": process.env.DB_HOST || '127.0.0.1',
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER || 'postgres',
    "password": process.env.DB_PASSWORD || 'password',
    "database": process.env.DB_NAME || 'database_test',
    "host": process.env.DB_HOST || '127.0.0.1',
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER || 'postgres',
    "password": process.env.DB_PASSWORD || 'password',
    "database": process.env.DB_NAME || 'database_production',
    "host": process.env.DB_HOST || '127.0.0.1',
    "dialect": "postgres"
  }
}