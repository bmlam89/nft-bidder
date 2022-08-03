const mongoose = require('mongoose');
const connectDB = async () => {
  let mongoUrl = process.env.MONGO_URI || 'mongodb+srv://kablam:Mongopass1!@cluster0.f3yys.mongodb.net/opensea?retryWrites=true&w=majority';
  try {
    await mongoose.connect(mongoUrl);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log("Unable to connect to MongoDB");
    process.exit(1);
  }
}
module.exports = connectDB;