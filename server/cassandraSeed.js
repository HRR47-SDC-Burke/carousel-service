const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1',
});

// const query = 'SELECT name, email FROM users WHERE key = ?';
// client.execute(query, [ 'someone' ])
//   .then(result => console.log('User with email %s', result.rows[0].email));

client.connect((err) => {
  if (err) throw err;
  console.log('Connected to client');
});

// `CREATE KEYSPACE carousel
//   WITH REPLICATION = {
//     'class' : 'SimpleStrategy',
//       'replication_factor' : 1
//    };`;
// `CREATE TABLE carousel.listings(
//    listing_id int PRIMARY KEY,
//    imageUrls set<text>
//  )`;
// COPY carousel.listings (listing_id, imageUrls)
//   FROM '/Users/jamesolivas/Downloads/hrr47/system-design-capstone/carousel-service/data.csv'
//   WITH HEADER = FALSE;
