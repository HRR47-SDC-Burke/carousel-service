const fs = require('fs');

const MAXIMUM_COUNT = 10000000;

let start;
let seconds;

const insert = (listingId, imageUrls) => new Promise((resolve, reject) => {
  const line = ''.concat(listingId, ',"', imageUrls.join(', '), '"\n');
  fs.appendFile('data.csv', line, (err, success) => {
    if (err) {
      reject(err);
    } else {
      resolve(success);
    }
  });
});

const gen1000 = (iteration) => {
  const allPromises = [];
  let primary = 1;
  while (primary <= 1000) {
    const totalImages = Math.floor(Math.random() * (25)) + 5;
    const imageUrls = [];
    for (let i = 1; i < totalImages; i += 1) {
      const img = Math.ceil(Math.random() * 369);
      imageUrls.push(`https://hrr47-sdc-burke-carousel-images.s3.us-west-1.amazonaws.com/img${img}.jpg`);
    }
    allPromises.push(insert(primary + iteration, imageUrls));
    primary += 1;
  }
  return Promise.all(allPromises)
    .then(() => {
      if (iteration % 1000000 === 0) {
        console.log(`${iteration} seeded!`);
      }
      if (iteration < MAXIMUM_COUNT) {
        gen1000(iteration + 1000);
      } else {
        seconds = Math.floor((new Date().getTime() - start) / 1000);
        console.log(`Done in ${seconds} seconds!`);
      }
    })
    .catch((err) => console.log(err));
};

const gen = () => {
  fs.writeFile('data.csv', '', (err) => {
    if (err) throw err;
    start = new Date().getTime();
    gen1000(0);
  });
};

gen();
