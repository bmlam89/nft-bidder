const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router.route("/register").post(userController.addUser);
router.route('/login').post(userController.login);
router.route('/submit').post(userController.submitConfigs);
//router.route("/top").get(userController.getTopCollections);
//router.route('/details/:slug').get(userController.getCollectionDetails);

module.exports = router;