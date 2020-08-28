require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  database: 'carousel',
  port: process.env.PG_PORT
});

pool
  .query('SELECT NOW() as now')
  .then(res => console.log(res))
  .catch(e => console.error(e.stack))

seed();
