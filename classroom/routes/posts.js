const express = require("express");
const  router = express.Router();

//posts
//Index
router.get("/", (req, res)=>{
    res.send("GET route for posts connect sucessfuly");
});
//show 
router.get("/:id", (req, res)=>{
    res.send("GET route for posts id connect successfuly");
});
//Post 
router.post("/", (req, res)=>{
    res.send("POST route for posts")
});
//delete 
router.delete("/:id",(req, res)=>{
    res.send("delete route for posts connect successfuly");
});

module.exports = router;