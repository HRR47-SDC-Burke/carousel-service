const db = require('../db');

// eslint-disable-next-line arrow-body-style
const insert = (locationId, url, order) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO images (location_id, url, img_order) VALUES (?, ?, ?)', [locationId, url, order], (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }
    });
  });
};

const seed = () => {
  const allPromises = [];
  let primary = 1;
  while (primary <= 100) {
    const totalImages = Math.floor(Math.random() * (25)) + 5;
    for (let i = 1; i < totalImages; i += 1) {
      const img = Math.ceil(Math.random() * 50);
      const imgUrl = `https://team-webber-image-carousel-472020.s3-us-west-2.amazonaws.com/${img}.webp`;
      allPromises.push(insert(primary, imgUrl, i));
    }
    primary += 1;
  }
  return Promise.all(allPromises)
    .then(() => console.log('mySQL DB seeded'))
    .catch((err) => console.log(err));
};

const seedOne = (primary, callback, imgCount = 0) => {
  const allPromises = [];
  const totalImages = Math.floor(Math.random() * (25)) + 5;
  for (let i = 1; i < totalImages; i += 1) {
    const img = Math.ceil(Math.random() * 50);
    const imgUrl = `https://team-webber-image-carousel-472020.s3-us-west-2.amazonaws.com/${img}.webp`;
    allPromises.push(insert(primary, imgUrl, i + imgCount));
  }
  return Promise.all(allPromises)
    .then(() => {
      console.log('mySQL DB updated');
      callback();
    })
    .catch((err) => console.log(err));
};

seed();

module.exports = { seedOne };
