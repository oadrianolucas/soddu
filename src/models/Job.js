const db = require("../database/db")
const Job = db.Sequelize.define("jobs", {
  name: {
    type: db.sequelize.STRING,
  },
  date: {
    type: db.sequelize.STRING,
  },
})

//Job.sync({ force: true });

module.exports = Job
