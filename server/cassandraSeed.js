const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1',
});

client.connect((err) => {
  if (err) throw err;
  console.log('Connected to client');
});
