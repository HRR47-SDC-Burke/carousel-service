require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('../db');
const client = require('../db/postgres.index.js');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/images/:id', (req, res) => {
  const id = req.params.id;
  client.query('SELECT * FROM listings WHERE listing_id = $1', [id], (err, data) => {
    if (err) {
      res.send('An error occurred');
    } else {
      const location_id = data.rows[0].listing_id;
      const urls = data.rows[0].imageurls;
      const sculptedData = urls.map((url, i) => {
        return {
          img_order: i + 1,
          location_id,
          url
        };
      });
      res.send(sculptedData);
    }
  })
});

// POST adds images with a new location_id
app.post('/api/images/', (req, res) => {
    const totalImages = Math.floor(Math.random() * (25)) + 5;
    const imageUrls = [];
    for (let i = 1; i < totalImages; i += 1) {
      const img = Math.ceil(Math.random() * 369);
      imageUrls.push(`https://hrr47-sdc-burke-carousel-images.s3.us-west-1.amazonaws.com/img${img}.jpg`);
    }
    let urlString = '"';
    urlString = urlString.concat(imageUrls.join('", "'), '"');
    client.query(`INSERT INTO listings (imageUrls) VALUES ('{${urlString}}')`, (err, data) => {
      if (err) {
        res.send('An error occurred');
      } else {
        res.sendStatus(200);
      }
    });
});

// PUT adds extra images with the given location_id
app.put('/api/images/:id', (req, res) => {
  db.query(`SELECT COUNT(IF(location_id = ${req.params.id}, 1, NULL)) FROM images`, (err, data) => {
    if (err) {
      res.send('An error occurred');
    } else {
      seedOne(req.params.id, () => {
        res.send(`Extra images added to listing ${req.params.id}`);
      }, data[0][`COUNT(IF(location_id = ${req.params.id}, 1, NULL))`]);
    }
  });
});

// DELETE removes all images with the given location_id
app.delete('/api/images/:id', (req, res) => {
  db.query(`DELETE FROM images WHERE location_id = ${req.params.id}`, (err) => {
    if (err) {
      res.send('An error occurred');
    } else {
      res.send(`Deleted images from listing ${req.params.id}`);
    }
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
