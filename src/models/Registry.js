const db = require("../database/db")
//const Schools = require("../models/Schools");

const Registry = db.Sequelize.define("registries", {
  name: {
    type: db.sequelize.STRING,
  },
  birth: {
    type: db.sequelize.STRING,
  },
  phone: {
    type: db.sequelize.STRING,
  },
  mother: {
    type: db.sequelize.STRING,
  },
  zipcode: {
    type: db.sequelize.STRING,
  },
  address: {
    type: db.sequelize.STRING,
  },
  district: {
    type: db.sequelize.STRING,
  },
  city: {
    type: db.sequelize.STRING,
  },
  state: {
    type: db.sequelize.STRING,
  },
  number: {
    type: db.sequelize.STRING,
  },
  note: {
    type: db.sequelize.STRING,
  },
})

//Schools.hasMany(Registry);

//Registry.sync({ force: true });

module.exports = Registry
