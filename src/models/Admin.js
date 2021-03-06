const db = require("../database/db")

const Admin = db.Sequelize.define("admins", {
  name: {
    type: db.sequelize.STRING,
  },
  login: {
    type: db.sequelize.STRING,
  },
  email: {
    type: db.sequelize.STRING,
  },
  password: {
    type: db.sequelize.STRING,
  },
  filter: {
    type: db.sequelize.STRING,
  },
  token: {
    type: db.sequelize.STRING,
  },
  confirmation: {
    type: db.sequelize.BOOLEAN,
  },
})

//User.sync({ force: true });

module.exports = User
