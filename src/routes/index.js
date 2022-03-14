const siteRouter = require("./site");
const auth = require("./auth");
const me = require("./me");
const post = require("./post");
const react = require("./react");
const follow = require("./follow");

function route(app){
  app.use("/", siteRouter);
  app.use("/auth",auth);
  app.use("/post", post);
  app.use("/me", me);
  app.use("/react", react);
  app.use("/follow", follow);
}

module.exports = route;