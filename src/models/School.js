const db = require("../database/db")

const School = db.Sequelize.define("schools", {
  name: {
    type: db.sequelize.STRING,
  },
  zone: {
    type: db.sequelize.STRING,
  },
})

//School.sync({ force: true });

module.exports = School
