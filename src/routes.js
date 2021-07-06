const router = require("express").Router();
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");
const DevAuthenticate = require("./controllers/DevAuthgenticateController")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken");
const authenticateDev= require("./middleware/authenticateDev")



router.post("/signup", DevAuthenticate.signup);
router.post("/login", DevAuthenticate.login);
router.get("/devs",authenticateDev, DevController.index);
router.post("/devs", authenticateDev,DevController.store);
router.post("/devs/:id/likes",authenticateDev, LikeController.store);
router.post("/devs/:id/dislikes",authenticateDev, DislikeController.store);

module.exports = router;
