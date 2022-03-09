const databaseConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const User = require("./User");
const FollowUser = require("./FollowUser");
const Role = require("./Role");
const UserRole = require("./UserRole");
const Post = require("./Post");
const Tag = require("./Tag");
const PostTag = require("./PostTag");
const Category = require("./Category")
const PostCategory = require("./PostCategory");
const Like = require("./Like");
const Comment = require("./Comment");
const CommentLike = require("./CommentLike");
const Status = require("./Status");

const db = {};
const sequelize = new Sequelize(
  databaseConfig.root.DB,
  databaseConfig.root.USER,
  databaseConfig.root.PASSWORD,
  {
    host : databaseConfig.host,
    dialect : databaseConfig.dialect,
    port : databaseConfig.port,
    pool: {
      max : databaseConfig.pool.max,
      min : databaseConfig.pool.min,
      idle : databaseConfig.idle,
      acquire: databaseConfig.pool.acquire
    }
  }
)
db.Role = Role(sequelize);
db.User = User(sequelize);
db.FollowUser = FollowUser(sequelize);
db.UserRole = UserRole(sequelize);
db.Status = Status(sequelize);
db.Category = Category(sequelize);
db.Tag = Tag(sequelize);
db.Post = Post(sequelize);
db.PostCategory = PostCategory(sequelize);
db.PostTag = PostTag(sequelize);
db.Like = Like(sequelize);
db.Comment = Comment(sequelize);
db.CommentLike = CommentLike(sequelize);
/* ======== association ======== */
// User <=-=> Role
db.User.belongsToMany(db.Role,{
  through: db.UserRole
})
db.Role.belongsToMany(db.User, {
  through: db.UserRole
})
// User <--=> Post
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
// User <=-=> User : user follows user 
db.User.belongsToMany(db.User,{
  through: db.FollowUser,
  as: "users"
})
db.User.belongsToMany(db.User,{
  through: db.FollowUser,
  as: "follower"
})
// Post <=-=> Tag
db.Post.belongsToMany(db.Tag,
  {
    through: db.PostTag,
    
  }
);
db.Tag.belongsToMany(db.Post,
  {
    through: db.PostTag
  }
);
// Post <=--> Status
db.Status.hasMany(db.Post);
db.Post.belongsTo(db.Status);
// Post <=-=> Category
db.Category.belongsToMany(db.Post,{
  through: db.PostCategory
});
db.Post.belongsToMany(db.Category,{
  through: db.PostCategory
});
// Like <=-=> Post
db.User.belongsToMany(db.Post,{
  through : db.Like
});
db.Post.belongsToMany(db.User,{
  through : db.Like
});
// Comment <=-->Post 
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);
// Comment <=-->User 
db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);
// Comment <---> Comment 
db.Comment.hasOne(db.Comment);
db.Comment.belongsTo(db.Comment);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Comment <=-=> User : user likes comment
db.Comment.belongsToMany(db.User,{
  through: db.CommentLike
})
db.User.belongsToMany(db.Comment,{
  through: db.CommentLike
})

module.exports = db;