const express = require("express");
const router = express.Router();
const collectionController = require('../controllers/collectionController');

router.route("/new").get(collectionController.getNewCollections);
router.route("/top").get(collectionController.getTopCollections);

module.exports = router;