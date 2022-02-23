const siteRouter = require("./site");
const auth = require("./auth");
function route(app){
  app.use("/", siteRouter);
  app.use("/auth",auth);
}

module.exports = route;