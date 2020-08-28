-- CREATE DATABASE IF NOT EXISTS carousel;

-- USE carousel;

DROP TABLE IF EXISTS listings;

CREATE TABLE listings (
  listing_id serial PRIMARY KEY,
  imageUrls text[]
);
