const express = require("express");
const cors = require("cors");
const app = express();
const ejs = require('ejs');
const path = require("path");
const route = require("./routes");


// cross origin resource sharing 
app.use(cors({
  "origin": "http://127.0.0.1:7777"
}));
// parse incoming request with Json Payload
app.use(express.json());
// parse incoming request with  url encoded payload
app.use(express.urlencoded({
  extended: true
}));
// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "resources","views"));
app.set("view option",{
  delimiter: "?"
})
route(app);
app.listen(7777, ()=>{
  console.log("app is running on port 7777!");
})

