module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      "user",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
        first_name: {
          type: Sequelize.STRING,
        },
        last_name: {
          type: Sequelize.STRING,
        },
        user_status: {
          type: Sequelize.ENUM,
          values: ["active", "pending", "banned"],
          defaultValue: "pending",
        },
      },
      {
        freezeTableName: true,
        underscored: true,
      }
    )
    return User
  }
  