const express = require("express");
const router = express.Router();
const { protected } = require("../middlewares/authMiddleware");
const { fetchChats, accessChat, createGroupChat, renameGroupChat, removeFromGroup, addToGroup } = require("../controllers/chatController");

router.route("/").post(protected, accessChat).get(protected, fetchChats);
router.route('/group').post(protected, createGroupChat).put(protected, renameGroupChat)
router.route('/group/remove').put(protected, removeFromGroup)
router.route('/group/add').put(protected, addToGroup)

module.exports = router;
