const Sequelize = require("sequelize")
const configJson = require("./config")

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development"
const config = configJson[env]

console.log("this is the environment: ", env)
console.log(config)

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port_db,
    dialect:
      config.dialect /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    logging: false,
  }
)

sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync({ alter: true })
    console.log("Connection has been established successfully.")
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err)
  })

const db = {}

db.sequelize = sequelize

//! Models
db.user = require("../model/user")(sequelize, Sequelize)

//! Relations

module.exports = db
