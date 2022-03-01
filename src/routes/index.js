const siteRouter = require("./site");
const auth = require("./auth");
const me = require("./me");
const post = require("./post");

function route(app){
  app.use("/", siteRouter);
  app.use("/auth",auth);
  app.use("/post", post);
  app.use("/me", me);
}

module.exports = route;