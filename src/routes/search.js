const express = require('express');
const router = express.Router();
const searchController = require("../app/controllers/SearchController");

router.get("/", searchController.getSearchPosts);
router.get("/get_posts", searchController.searchPosts);
module.exports = router