const mongoose = require("mongoose");
const timeseriesCollectionSchema = new mongoose.Schema({
  slug: String,
});

const timeseriesCollection = mongoose.model('timeseriesOsCollections', timeseriesCollectionSchema, 'timeseriesOsCollections');

module.exports = timeseriesCollection;