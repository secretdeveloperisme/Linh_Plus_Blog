const siteRouter = require("./site");

function route(app){
  app.use("/", siteRouter);
}

module.exports = route;