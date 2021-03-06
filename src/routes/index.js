const siteRouter = require("./site");
const auth = require("./auth");
const me = require("./me");
const post = require("./post");
const react = require("./react");
const follow = require("./follow");
const comment = require("./comment");
const user = require("./user");
const tag = require("./tag");
const category = require("./category");
const search = require("./search");
const admin = require("./admin");
const error = require("./error");

function route(app){
  app.use("/", siteRouter);
  app.use("/auth",auth);
  app.use("/post", post);
  app.use("/me", me);
  app.use("/react", react);
  app.use("/follow", follow);
  app.use("/comment", comment);
  app.use("/user", user);
  app.use("/tag", tag);
  app.use("/category", category);
  app.use("/search", search);
  app.use("/admin", admin);
  app.use("*",error);
}

module.exports = route;