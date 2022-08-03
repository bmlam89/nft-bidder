const mongoose = require("mongoose");
const collectionSchema = new mongoose.Schema({
  name: String,
  slug: String,
  address: String
});

const Collection = mongoose.model('osCollections', collectionSchema, 'osCollections');

module.exports = Collection;