require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  database: 'carousel',
  port: process.env.PG_PORT
});

const MAXIMUM_COUNT = 100;

const insert = (listing_id, imageUrls) => {
  return new Promise((resolve, reject) => {
    let queryString = `INSERT INTO listings (listing_id, imageUrls) VALUES (${listing_id}, {"`;
    queryString += imageUrls[0];
    for (var i = 1; i < imageUrls.length; i++) {
      queryString += '", "' + imageUrls[i];
    }
    queryString += '"});';
    pool.query(queryString, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }
    })
  });
};

const seed = () => {
  const allPromises = [];
  let primary = 1;
  while (primary <= MAXIMUM_COUNT) {
    const totalImages = Math.floor(Math.random() * (25)) + 5;
    const imageUrls = [];
    for (let i = 1; i < totalImages; i += 1) {
      const img = Math.ceil(Math.random() * 369);
      imageUrls.push(`https://hrr47-sdc-burke-carousel-images.s3.us-west-1.amazonaws.com/img${img}.jpg`);
    }
    allPromises.push(insert(primary, imageUrls));
    primary += 1;
  }
  return Promise.all(allPromises)
    .then(() => console.log('Postgres DB seeded'))
    .catch((err) => console.log(err));
};

// pool
//   .query('SELECT NOW() as now')
//   .then(res => console.log(res))
//   .catch(e => console.error(e.stack))

seed();
