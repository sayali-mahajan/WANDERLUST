const express = require("express");
const  router = express.Router();

//Indexroute-Users
router.get("/", (req, res)=>{
    res.send("Get route connect sucessfuly");
});
//show route-users
router.get("/:id", (req, res)=>{
    res.send("GET  route for id connect successfuly");
});
//Post route-users
router.post("/", (req, res)=>{
    res.send("post route for users")
});
//delete route-users
router.delete("/:id",(req, res)=>{
    res.send("delete route connect successfuly");
});
 module.exports = router;