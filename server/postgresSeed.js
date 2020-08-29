require('dotenv').config();
const fs = require('fs');
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  database: 'carousel',
  port: process.env.PG_PORT
});

// pool
//   .query('SELECT NOW() as now')
//   .then(res => console.log(res))
//   .catch(e => console.error(e.stack))

const parseData = (line) => {
  const listingNumber = line.split(',"')[0];
  const urls = line.split('"')[1].split(', ');
  console.log(listingNumber, urls);
};

const seed = () => {
  fs.readFile('dataSample.csv', 'utf8', (err, data) => {
    if (err) throw err;
    const content = data.split('\n');
    for (let i = 0; i < content.length; i++) {
      parseData(content[i]);
    }
  })
};

seed();
