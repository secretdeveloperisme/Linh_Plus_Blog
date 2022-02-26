const siteRouter = require("./site");
const auth = require("./auth");
const me = require("./me");

function route(app){
  app.use("/", siteRouter);
  app.use("/auth",auth);
  app.use("/me", me);
}

module.exports = route;