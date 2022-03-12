const School = require("../models/Schools")
const SchoolsController = {
  GetFindAllSchools(req, res) {
    School.findAll().then((school) => {
      res.render("admin/school/schools", {
        school: school.map((school) => school.toJSON()),
      })
    })
  },
  GetUpdateSchool(req, res) {
    var id = req.params.id
    School.findByPk(id).then((school) => {
      if (school != undefined) {
        res.render("admin/school/update", { school: school.toJSON() })
      } else {
        res.redirect("/admin/schools")
      }
    })
  },

  PostCreateSchool(req, res) {
    const name = req.body.name
    const zone = req.body.zone
    School.create({
      name: name.toLowerCase(),
      zone: zone,
    })
      .then(() => {
        res.redirect("/admin/schools")
      })
      .catch((erro) => {
        res.send("Error ao criar nova escola." + erro)
      })
  },

  PostDeleteSchool(req, res) {
    var id = req.body.id
    if (id != undefined) {
      if (!isNaN(id)) {
        School.destroy({
          where: {
            id: id,
          },
        }).then(() => {
          res.redirect("/admin/schools")
        })
      } else {
        res.redirect("/admin/schools")
      }
    } else {
      res.redirect("/admin/schools")
    }
  },

  PostUpdateSchool(req, res) {
    var id = req.body.id
    var name = req.body.name
    var zone = req.body.zone
    School.update(
      {
        name: name.toLowerCase(),
        zone: zone,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/schools")
    })
  },
}

module.exports = SchoolsController
