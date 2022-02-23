const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const route = require("./routes");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
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
// set public folder
app.use(express.static(path.join(__dirname,"public")));
// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "resources","views"));
app.set("view option",{
  delimiter: "?"
})
// method override for put delete API
app.use(methodOverride("_method"));
// use cookie parser middleware
app.use(cookieParser())
//route app
route(app);

app.listen(7777, ()=>{
  console.log("app is running on port 7777!");
})

