const helpers = require('../utils/helpers');
const Collection = require('../models/Collection');

exports.getNewCollections = async (req, res) => {
  try {
    let pipeline = [
      { 
        '$match': { '$and': [
          {'stats.floor_price': { '$gte': .2 } }, 
          {'stats.count': {'$gte': 3000} },
          
        ]} 
      },
      { '$sort': { 'stats.one_day_sales': -1 } },
      { '$limit': 15}
    ];
    let newCollections = await Collection.aggregate(pipeline);
    let formattedNewCollections = []
    newCollections.map((collection) => {
      let release_date = collection.listing_date
      release_date = new Date(release_date+'Z');
      let elapsed_time = helpers.getElapsedTime(release_date);
      formattedNewCollections.push({
        banner_src: collection.banner_image_url ? collection.banner_image_url : false,
        image_url: collection.image_url ? collection.image_url : false,
        payment_token: collection.payment_tokens.filter(token => token.symbol === 'ETH'),
        name: collection.name,
        slug: collection.slug,
        address: collection.address,
        release_date: release_date.toString(),
        elapsed_time: elapsed_time,
        supply: collection.stats.count < 1000 ? collection.stats.count : parseFloat((collection.stats.count / 1000).toFixed(1))+'K' ,
        owners: collection.stats.num_owners < 1000 ? collection.stats.num_owners : Number((collection.stats.num_owners/1000).toFixed(1))+'K',
        floor_price: collection.stats.floor_price,
        one_day_sales: collection.stats.one_day_sales,
        one_dayvolume: parseFloat(Number(+collection.stats.one_day_volume)).toFixed(1),
        one_day_change: Number((+collection.stats.one_day_change*100).toFixed(1)),
        mkt_cap: parseFloat(Number(+collection.stats.market_cap)).toFixed(1),
        seller_fees: collection.seller_fees
      })
    });
    res.status(200).json({
      status: "success",
      data: formattedNewCollections.sort((c1,c2) => new Date(c2.release_date) - new Date(c1.release_date)),
    });
  } catch(e) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "collectionController error when trying to fetch NEW collections",
    });
  }
}

exports.getTopCollections = async (req, res) => {
  try {
    let pipeline = [
      { '$sort': { 'stats.seven_day_volume': -1 } },
      { '$skip': 0 },
      { '$limit': 50 }
    ];
    let topCollections = await Collection.aggregate(pipeline);
    let formattedTopCollections = [];
    topCollections.map((collection) => 
      formattedTopCollections.push({
        image_url: collection.image_url,
        payment_token: collection.payment_tokens.filter(token => token.symbol === 'ETH'),
        name: collection.name,
        slug: collection.slug,
        address: collection.address,
        supply: collection.stats.count < 1000 ? collection.stats.count : parseFloat((collection.stats.count / 1000).toFixed(1))+'K' ,
        floor_price: collection.stats.floor_price,
        one_day_sales: collection.stats.one_day_sales && +collection.stats.one_day_sales > 1000 ? Number((collection.stats.one_day_sales/1000).toFixed(1))+'K' : +collection.stats.one_day_sales.toFixed(1),
        one_day_average_price: +collection.stats.one_day_average_price < .01 ? parseFloat(Number(collection.stats.floor_price)).toFixed(3) : parseFloat(Number(collection.stats.one_day_average_price)).toFixed(1),
        seven_day_sales: collection.stats.seven_day_sales && +collection.stats.seven_day_sales > 1000 ? Number((collection.stats.seven_day_sales/1000).toFixed(1))+'K' : +collection.stats.seven_day_sales.toFixed(1),
        seven_day_volume: collection.stats.seven_day_volume && +collection.stats.seven_day_volume > 1000 ? Number((collection.stats.seven_day_volume/1000).toFixed(1))+'K' : +collection.stats.seven_day_volume.toFixed(1),
        seven_day_change: collection.stats.seven_day_change  && +collection.stats.seven_day_change > 1000 ? Number((collection.stats.seven_day_change/1000).toFixed(1))+'K' : +collection.stats.seven_day_change.toFixed(1),
        mkt_cap: collection.stats.market_cap && +collection.stats.market_cap > 1000 ? Number((collection.stats.market_cap/1000).toFixed(1))+'K' : +collection.stats.market_cap.toFixed(1),
        seller_fees: collection.seller_fees
      })
    )
    res.status(200).json({
      status: "success",
      data: formattedTopCollections,
    });
  } catch(e) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "collectionController error when trying to fetch TOP collections",
    });
  }
}