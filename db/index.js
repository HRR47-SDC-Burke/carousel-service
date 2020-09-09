const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  user: process.env.PG_USER,
  password: process.env.PG_PWD,
  host: process.env.PG_HOST,
  database: 'carousel',
  port: process.env.PG_PORT,
});

client.connect();

module.exports = client;
