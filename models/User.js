const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  address: String,
  proxy: String,
  proxyPK: String,
  configs: Array,
  updatedAt: String
});

const User = mongoose.model('users', userSchema, 'users');

module.exports = User;