require("dotenv").config();
const express = require("express");
const path = require('path');

const connectDB = require('./configs/db');
const collectionRoutes = require("./routes/collectionRoutes");
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();
app.use(express.json());
app.use("/collection", collectionRoutes);
app.use('/user', userRoutes)

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  })
} else {
  app.get('/', (req, res) => {
    res.send('Api running')
  })
}

const PORT = process.env.PORT || '4000';
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));