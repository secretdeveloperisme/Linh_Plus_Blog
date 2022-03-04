const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.config");
const db = require("../models");
class SiteController {
  // GET: /
  index(req, res) {
    let data = {
      posts: null,
      user: null
    };
    let token = req.cookies["accessToken"];
    db.Post.findAll({
      attributes: "",
      include: [{
        model: db.User,
        attributes: ["username"]
      }, {
        model: db.Category,
        attributes: ["id", "name"]
      }, {
        model: db.Tag,
        attributes: ["id", "name"]
      }],
      order: [["createdAt", "DESC"]]
    })
      .then(posts => {
        data.posts = posts;
        db.Category.findAll()
          .then(categories => {
            data.categories = categories;
            db.Tag.findAll()
              .then(tags => {
                data.tags = tags;
                if (token)
                  jwt.verify(token, authConfig.secretKey, (err, decode) => {
                    let userId = decode.userId;
                    if (err) {
                      res.render("site/home", data);
                    }
                    db.User.findOne({
                      where: {
                        id: userId
                      }
                    })
                      .then(user => {
                        if (user) {
                          data.user = user;
                          res.render("site/home", data)

                        }
                        else {
                          res.render("site/home", data);
                        }
                      })
                      .catch(err => {
                        res.render("site/home", data);
                      })
                  })
                else {
                  res.render("site/home", data);
                }
              })
          })
      })
  }
}
module.exports = new SiteController();