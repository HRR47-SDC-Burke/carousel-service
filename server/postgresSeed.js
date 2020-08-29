require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  database: 'carousel',
  port: process.env.PG_PORT,
});

let start;
let seconds;

const parseData = (line) => new Promise((resolve, reject) => {
  let urls = '';
  urls = urls.concat('"', line.split('"')[1].split(', ').join('", "'), '"');
  pool.query(`INSERT INTO listings (imageUrls) VALUES ('{${urls}}')`, (err, success) => {
    if (err) {
      reject(err);
    } else {
      resolve(success);
    }
  });
});

const parseFile = (filenames, maximum, index = 0) => {
  fs.readFile(`data/${filenames[index]}`, 'utf8', (err, data) => {
    if (err) throw err;
    const allPromises = [];
    const content = data.split('\n').filter((i) => i !== '');
    for (let i = 0; i < content.length; i += 1) {
      allPromises.push(parseData(content[i]));
    }
    return Promise.all(allPromises)
      .then(() => {
        if (index + 1 < maximum) {
          if (index % 50 === 0) {
            seconds = Math.floor((new Date().getTime() - start) / 1000);
            console.log(index, 'of', maximum, 'files seeded in', seconds, 'seconds');
          }
          parseFile(filenames, maximum, index + 1);
        } else {
          pool.query('SELECT COUNT(*) FROM listings', (err2, countData) => {
            if (err2) throw err2;
            seconds = Math.floor((new Date().getTime() - start) / 1000);
            console.log('Seeded', countData.rows[0].count, 'rows in', seconds, 'seconds!');
            pool.end();
          });
        }
      })
      .catch((error) => console.log(error));
  });
};

const seed = () => {
  pool.query('DROP TABLE IF EXISTS listings', (err) => {
    if (err) throw err;
    const makeTable = `CREATE TABLE listings (
      listing_id serial PRIMARY KEY,
      imageUrls text[]
    );`;
    pool.query(makeTable, (err2) => {
      if (err2) throw err2;
      fs.readdir('data', (err3, data) => {
        if (err3) throw err3;
        start = new Date().getTime();
        parseFile(data, data.length);
      });
    });
  });
};

seed();
