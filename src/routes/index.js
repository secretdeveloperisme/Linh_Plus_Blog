const siteRouter = require("./site");
const auth = require("./auth");
const me = require("./me");
const post = require("./post");
const react = require("./react");
const follow = require("./follow");
const comment = require("./comment");
const user = require("./user");

function route(app){
  app.use("/", siteRouter);
  app.use("/auth",auth);
  app.use("/post", post);
  app.use("/me", me);
  app.use("/react", react);
  app.use("/follow", follow);
  app.use("/comment", comment);
  app.use("/user", user);
}

module.exports = route;