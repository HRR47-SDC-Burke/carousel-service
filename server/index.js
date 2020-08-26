const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('../db');
const { seedOne } = require('./datagen');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use('/:id', express.static(path.join(__dirname, '/../client/dist')));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/images/:id', (req, res) => {
  const id = req.url.slice(12);
  db.query('SELECT * FROM images WHERE location_id = ? ORDER BY img_order ASC', [id], (err, data) => {
    if (err) {
      res.send('An error occurred');
    } else {
      res.send(data);
    }
  });
});

app.post('/api/images/', (req, res) => {
  db.query('SELECT MAX(location_id) FROM images', (err, data) => {
    if (err) {
      res.send('An error occurred');
    } else {
      const destination = data[0]['MAX(location_id)'] + 1;
      seedOne(destination, () => {
        res.send(`Created listing ${destination}`);
      });
    }
  });
});

app.put('/api/images/:id', (req, res) => {
  db.query(`SELECT COUNT(IF(location_id = ${req.params.id}, 1, NULL)) FROM images`, (err, data) => {
    if (err) {
      res.send('An error occurred');
    } else {
      console.log(data[0][`COUNT(IF(location_id = ${req.params.id}, 1, NULL))`]);
      seedOne(req.params.id, () => {
        res.send(`Extra images added to listing ${req.params.id}`);
      }, data[0][`COUNT(IF(location_id = ${req.params.id}, 1, NULL))`]);
    }
  });
});

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
