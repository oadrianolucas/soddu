const sequelize = require("sequelize")
const Sequelize = new sequelize("schema", "user", "password", {
  host: "localhost",
  dialect: "mysql",
})

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
}

Sequelize.authenticate()
  .then(() => {
    console.log("Conexão realizada com sucesso ao banco de dados")
  })
  .catch(() => {
    console.log("Error ao se conectar com o banco de dados" + err)
  })
