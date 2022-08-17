const helpers = require('../utils/helpers');
const User = require('../models/User');
const mongoose = require('mongoose');
const CryptoJS = require("crypto-js");
const axios  = require('axios');
const TIME_OPTIONS = { 
  timeZone: 'America/Los_Angeles', 
  hour12: true, 
  hourCycle: 'h12', 
  month: 'numeric',
  day: 'numeric',
  year: '2-digit',
  hour: 'numeric',
  minute: '2-digit' 
};
const TIME_REGION = 'en-US';
exports.addUser = async (req, res) => {
  try {
    let user = await User.findOne({'address': req.body.address}).exec();
   
    if(!user) {
      await mongoose.connect(process.env.MONGO_URI);
      let query = {
        address: req.body.address,
        proxy: req.body.proxy,
        proxyPK: CryptoJS.AES.encrypt(req.body.proxyPK, process.env.SEED).toString(),
        configs: [],
        updatedAt: (new Date()).toLocaleString(TIME_REGION, TIME_OPTIONS)
      }
      let addedUser = await User.create(query);
      res.status(200).json({
        status: "success",
        user: addedUser
      });
    } else {
      res.status(200).json({
        status: "wallet already exists in db",
        data: user
      });
    }    
  } catch(e) {
    console.error(e);
    res.status(500).json({
      status: "error",
      message: "userController error when trying to register new wallet",
    });
  }
}

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({'address': req.body.address}).exec();
    if(user) {
      res.status(200).json({
        status: "success",
        user: user
      });
    }

  } catch(e) {
    console.error(e);
    res.status(500).json({
      status: "error",
      message: "userController error when trying to login",
    });
  }
}

exports.submitConfigs = async (req, res) => {
  try {
    req.body.configs.map(async (config) => {
      let { start, nextSweep, expiration } = helpers.formatSweeperTimestamps(config);
      config.start = start.toLocaleString();
      config.nextSweep = nextSweep.toLocaleString(TIME_REGION, TIME_OPTIONS); 
      config.expiration = expiration.toLocaleString(TIME_REGION, TIME_OPTIONS);
      return config;
    });

    let query = { address: req.body.address };
    let update = { 
      configs: req.body.configs, 
      updatedAt: (new Date()).toLocaleString(TIME_REGION, TIME_OPTIONS)
    };
    
    let doc = await User.findOneAndUpdate(query, update);
    console.log(doc,'docccc');
    res.status(200).json({
      status: "success",
      user: doc
    });  } catch(e) {
    console.error(e);
    res.status(500).json({
      status: "error",
      message: "userController error when trying to submit sweeper configs",
    });
  }
}