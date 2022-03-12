const Registry = require("../models/Registry")
const sqlz = require("sequelize")
const School = require("../models/Schools")

const RegistrysController = {
  GetFindAllRegistrys(req, res) {
    Registry.findAll().then((registry) => {
      res.render("admin/registry/registrys", {
        registry: registry.map((registry) => registry.toJSON()),
      })
    })
  },

  GetCreateRegistry(req, res) {
    School.findAll().then((school) => {
      res.render("admin/registry/create", {
        school: school.map((school) => school.toJSON()),
      })
    })
  },

  GetViewRegistry(req, res) {
    var id = req.params.id
    Registry.findByPk(id).then((registry) => {
      if (registry != undefined) {
        res.render("admin/registry/view", { registry: registry.toJSON() })
      } else {
        res.redirect("/admin/registrys")
      }
    })
  },

  GetUpdateRegistry(req, res) {
    var id = req.params.id
    Registry.findByPk(id).then((registry) => {
      if (registry != undefined) {
        School.findAll().then((school) => {
          res.render("admin/registry/update", {
            registry: registry.toJSON(),
            school: school.map((school) => school.toJSON()),
          })
        })
      } else {
        res.redirect("/admin/registrys")
      }
    })
  },

  PostCreateRegistry(req, res) {
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

    Registry.create({
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
        res.redirect("/admin/registrys")
      })
      .catch((erro) => {
        res.send("Error ao realizar o cadastrado" + erro)
      })
  },

  PostDeleteRegistry(req, res) {
    var id = req.body.id
    if (id != undefined) {
      if (!isNaN(id)) {
        Registry.destroy({
          where: {
            id: id,
          },
        }).then(() => {
          res.redirect("/admin/registrys")
        })
      } else {
        res.redirect("/admin/registrys")
      }
    } else {
      res.redirect("/admin/registrys")
    }
  },

  PostUpdateRegistry(req, res) {
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

    Registry.update(
      {
        name: name,
        birth: birth,
        phone: phone,
        mother: mother,
        zipcode: zipcode,
        address: address,
        district: district,
        city: city,
        state: state,
        number: number,
        school: school,
        note: note,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/registrys")
    })
  },

  GetSearchRegistrys(req, res) {
    const { term, filter } = req.query
    const Op = sqlz.Op

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

    Registry.findAll({
      where: termsFilter,
    }).then((termsFilter) => {
      console.log(termsFilter)
      res.render("admin/registry/registrys", {
        registry: termsFilter.map((registry) => registry.toJSON()),
      })
    })
  },
}

module.exports = RegistrysController
