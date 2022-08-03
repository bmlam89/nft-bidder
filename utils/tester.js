require('dotenv').config();
const MongoHandler = require('../handlers/mongoHandler');
const OsHandler = require('../handlers/osHandler');
const mongoHandler = new MongoHandler();
const osHandler = new OsHandler();
const { MongoClient } = require("mongodb");
const axios = require('axios').default;
const Web3 = require('web3');
const nodeUrl = `https://${process.env.NODE_NET}.infura.io/v3/${process.env.NODE_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
const opensea = require('opensea-js');
const Network = opensea.Network;
const { OpenSeaStreamClient } = require('@opensea/stream-js');
const WebSocket = require('ws');
const OpenSeaPort = opensea.OpenSeaPort;
const EventType = opensea.EventType;
const ethers = require("ethers");
const CryptoJS = require("crypto-js");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const MAX_OS_LIMIT = 30
const MAX_FLOOR_MULTIPLIER = 3;
const MAX_WAITING_TIME = 72;
const SECONDS_IN_A_DAY = 86400;
const BUY_SIDE = 0;
const SELL_SIDE = 1;
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
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

/* = new OpenSeaPort(provider, {
  networkName: Network.Main,
  apiKey: 'c1afc836148e424ca57553b528e965a0'
})*/
const client = new MongoClient(process.env.MONGO_URI);

const main = async () => {
  await client.connect();
  db = client.db('opensea');

  let timeOptions = { 
    timeZone: 'America/Los_Angeles', 
    hour12: true, 
    hourCycle: 'h12', 
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit' 
  };
  let region = 'en-US';
  let timestamp = new Date();
  timestamp.setMinutes( Math.round(timestamp.getMinutes() / 5) * 5 );
  let timestampStr = timestamp.toLocaleString(region,timeOptions);
  let usersToSweep = await mongoHandler.fetchUsersToSweep(db);
  usersToSweep.map(async (user) => {
    //console.log(user.configs[0].collections,'userToSweep');
    user.configsToSweep = [];
    user.allCollections = {};

    user.configs.map((config, config_id) => {
      if(config.nextSweep === timestampStr) {
        config.id = config_id;
        user.configsToSweep.push(config);
        config.collections.map(collection => user.allCollections[collection.slug] = {});
      }
    })
    return user;
    //mongoHandler.updateUserAfterSweeping(db, user);
  });
  
  (async function recursivelySweepListings(user_id, config_id, collection_id, cursor) {
    setTimeout(async () => {
      let user = usersToSweep[user_id];
      let configToSweep = user.configsToSweep[config_id];
      let collection = configToSweep.collections[collection_id];
      if(Object.keys(collection.assets).length < configToSweep.assetQty) {
        let { assets, nextCursor, allCollections } = await osHandler.test(user.address, config_id, user.allCollections, collection, cursor);
        console.log(assets,'assets',collection.slug);
        if(Object.keys(assets).length) {
          Object.entries(assets).map(([token_id, orderBook]) => {
            collection.assets[token_id] = {
              listings: orderBook.listings,
              offers: orderBook.offers
            }
          })
        } 
        
        cursor = nextCursor;
        usersToSweep[user_id].allCollections = allCollections;
        recursivelySweepListings(user_id, config_id, collection_id, cursor);
      } else {
        collection_id += 1;
        if(collection_id < configToSweep.collections.length) {
          try {
            recursivelySweepListings(user_id, config_id, collection_id, false);
          } catch (e) {
            console.log('error inside collection_id < configToSweep.collections.length');
            let timeout = setTimeout(() => recursivelySweepListings(user_id, config_id, collection_id, false), 1000);
            clearTimeout(timeout);
          }
        } else {
          //this is where we want to send offers
          usersToSweep[user_id].configsToSweep[config_id].collections[collection_id].assets[token_id] = collection;
          console.log('Done getting listings for', user.address);
          //console.log(user.address,collection,'printing out collection');
          config_id += 1
          if(config_id < user.configsToSweep.length) {
            try {
              recursivelySweepListings(user_id, config_id, 0, false);
            } catch (e) {
              console.log('error inside configIdx < user.configsToSweep.length');
              let timeout = setTimeout(() => recursivelySweepListings(user_id, config_id, 0, false), 1000);
              clearTimeout(timeout);
            }
          }else {
            user_id += 1;
            if(user_id < usersToSweep.length) {
              try {
                recursivelySweepListings(user_id, 0, 0, false);
              } catch (e) {
                console.log('error inside config_id < usersToSweep.length');
                let timeout = setTimeout(() => recursivelySweepListings(user_id, 0, 0, false), 1000);
                clearTimeout(timeout);
              }
            } else {
              usersToSweep.map(async user => {
                //osHandler.sendOffers(user);
                user.configsToSweep.map(config => {
                  config.collections.map(collection => {
                    Object.entries(collection.assets).map(([tokenId,asset]) => {
                      console.log(tokenId, asset,' OMFGGGG');
                    })
                  })
                })
                /*user.configsToSweep.map((config, cIdx) => {
                  if(!cIdx) {
                    config.collections.map((collection,clIdx) => {
                      if(!clIdx) {
                        Object.entries(collection.listings).map(([token_id, listings]) => {
                          listings.sellOrders.map((sellOrder, idx) => {
                            console.log(token_id,web3.utils.fromWei(sellOrder.currentPrice+'','ether'),`sell-${idx}`);
                          });
                        });
                        Object.entries(collection.listings).map(([token_id, listings]) => {
                          listings.buyOrders.map((buyOrder, idx) => {
                            console.log(token_id,web3.utils.fromWei(buyOrder.currentPrice+'','ether'),`buy-${idx}`);
                          });
                        });
                      }
                    });
                  };
                });*/
              });
            };
          };
        };
      };
    },5000)
  })(user_id = 0, config_id = 0, collection_id = 0, cursor = false);
  /*console.log(usersToSweep, 'before removing expired configs');

  let removeExpiredConfigs = await mongoHandler.removeExpiredSweepersFromUsers(db, usersToSweep);
  usersToSweep = await mongoHandler.fetchUsersToSweep(db);
  console.log(usersToSweep,'after removing expired configs');*/
  
    

}
const main2 = async () => {
  let proxyPK = 'vital extra ramp wood cave total stamp open shell hard foot tortoise'
  let walletProvider = new HDWalletProvider({
    mnemonic: {
        phrase: proxyPK
    },
      providerOrUrl: nodeUrl
  });
  const buyerSeaport = new opensea.OpenSeaSDK(walletProvider, {
    networkName: Network.Main,
    apiKey: process.env.OS_KEY
  });
  let maxWaitingTime = new Date();
  maxWaitingTime = new Date(maxWaitingTime.setHours(maxWaitingTime.getHours() + 1));
  let offer = {
    asset: {
      tokenId: 9314,
      tokenAddress: "0x1485297e942ce64E0870EcE60179dFda34b4C625",
      schemaName:'ERC721' // WyvernSchemaName. If omitted, defaults to 'ERC721'. Other options include 'ERC20' and 'ERC1155'
    },
    accountAddress: "0xa6f42607427a85a5434bc7003737ed75c3289dd4",
    startAmount: 0.1,
    expirationTime: Math.round(maxWaitingTime.getTime() / 1000),
    quantity: 1
  }
  const confirmedOffer = await buyerSeaport.createBuyOrder(offer).then(response => {
    console.log(response,'response')
    return response
  }).catch(error => {
    console.error(error,'error inside catch')
  })
  console.log(confirmedOffer,'holy fuckin shit confirmed offer');
  return confirmedOffer
}
main2()