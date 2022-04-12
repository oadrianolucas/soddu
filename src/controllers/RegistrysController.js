const sequelize = require("sequelize")
const User = require("../models/User")
const School = require("../models/Schools")

const UsersController = {
  GetFindAllUsers(req, res) {
    User.findAll().then((user) => {
      res.render("admin/users", {
        user: user.map((user) => user.toJSON()),
      })
    })
  },

  GetCreateUser(req, res) {
    School.findAll().then((school) => {
      res.render("admin/user/create", {
        school: school.map((school) => school.toJSON()),
      })
    })
  },

  GetViewUser(req, res) {
    var id = req.params.id
    User.findByPk(id).then((user) => {
      if (user != undefined) {
        res.render("admin/user/view", { user: user.toJSON() })
      } else {
        res.redirect("/admin/users")
      }
    })
  },

  GetUpdateUser(req, res) {
    var id = req.params.id
    User.findByPk(id).then((user) => {
      if (user != undefined) {
        School.findAll().then((school) => {
          res.render("admin/user/update", {
            user: user.toJSON(),
            school: school.map((school) => school.toJSON()),
          })
        })
      } else {
        res.redirect("/admin/users")
      }
    })
  },

  PostCreateUser(req, res) {
    const name = req.body.name
    const birth = req.body.birth
    const phone = req.body.phone
    const mother = req.body.mother
    const zipcode = req.body.zipcode
    const address = req.body.address
    const district = req.body.district
    const city = req.body.city
    const state = req.body.state
    const number = req.body.number
    const school = req.body.school
    const note = req.body.note

    User.create({
      name: name.toLowerCase(),
      birth: birth.toLowerCase(),
      phone: phone,
      mother: mother.toLowerCase(),
      zipcode: zipcode,
      address: address.toLowerCase(),
      district: district.toLowerCase(),
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      number: number,
      note: note.toLowerCase(),
      schoolId: school,
    })
      .then(() => {
        res.redirect("/admin/users")
      })
      .catch((erro) => {
        res.send("Error ao realizar o cadastrado" + erro)
      })
  },

  PostDeleteUser(req, res) {
    var id = req.body.id
    if (id != undefined) {
      if (!isNaN(id)) {
        User.destroy({
          where: {
            id: id,
          },
        }).then(() => {
          res.redirect("/admin/users")
        })
      } else {
        res.redirect("/admin/users")
      }
    } else {
      res.redirect("/admin/users")
    }
  },

  PostUpdateUser(req, res) {
    var id = req.body.id
    var name = req.body.name
    var birth = req.body.birth
    var phone = req.body.phone
    var mother = req.body.mother
    var zipcode = req.body.zipcode
    var address = req.body.address
    var district = req.body.district
    var city = req.body.city
    var state = req.body.state
    var number = req.body.number
    var school = req.body.school
    var note = req.body.note

    User.update(
      {
        name: name,
        birth: birth,
        phone: phone,
        Registrys,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/user")
    })
  },
  GetSearchUsers(req, res) {
    const { term, filter } = req.query
    const Op = sequelize.Op

    let termsFilter = {}
    if (filter === "1")
      termsFilter = {
        name: {
          [Op.like]: `%${term}%`,
        },
      }
    if (filter === "2")
      termsFilter = {
        zipcode: {
          [Op.like]: `%${term}%`,
        },
      }
    if (filter === "3")
      termsFilter = {
        address: {
          [Op.like]: `%${term}%`,
        },
      }

    User.findAll({
      where: termsFilter,
    }).then((termsFilter) => {
      console.log(termsFilter)
      res.render("admin/users", {
        user: termsFilter.map((user) => user.toJSON()),
      })
    })
  },
}

module.exports = UsersController
