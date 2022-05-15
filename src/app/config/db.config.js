module.exports = {
  host: "127.0.0.1",
  dialect: "mysql",
  port : 3306,
  pool : {
    max: 5, 
    min : 5,
    acquire: 30000,
    idle: 10000
  },
  root: {
    USER: "hoanglinh",
    PASSWORD : "hoanglinh777",
    DB: "linh_plus_blog",
  }
}