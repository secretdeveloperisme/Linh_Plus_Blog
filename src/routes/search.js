const express = require('express');
const router = express.Router();
const searchController = require("../app/controllers/SearchController");

router.get("/", searchController.getSearchPosts);
router.get("/get_posts", searchController.searchPosts);
router.get("/get_users", searchController.searchUsers)
router.get("/get_tags", searchController.searchTags)
module.exports = router