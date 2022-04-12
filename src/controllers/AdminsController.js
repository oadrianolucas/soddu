const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const mailer = require("nodemailer")
const crypto = require("crypto")
const alert = require("../middlewares/alert")
const AdminsController = {
  GetFindAllAdmins(req, res) {
    Admin.findAll().then((admin) => {
      res.render("admin/admins", {
        admin: admin.map((admin) => admin.toJSON()),
      })
    })
  },

  GetUpdateAdmin(req, res) {
    const id = req.params.id
    Admin.findByPk(id).then((admin) => {
      if (admin != undefined) {
        res.render("admin/admin/update", { admin: admin.toJSON() })
      } else {
        res.redirect("/admin/settings")
      }
    })
  },

  PostCreateAdmin(req, res) {
    const name = req.body.name
    const login = req.body.login
    const email = req.body.email
    const password = crypto.randomBytes(2).toString("hex")
    const filter = req.body.filter
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const url = process.env.PUBLIC_URL
    const token = crypto.randomBytes(64).toString("hex")

    Admin.create({
      name: name.toLowerCase(),
      login: login,
      email: email,
      password: hash,
      filter: filter,
      token: token,
      confirmation: false,
    })
      .then(() => {
        const tranporter = mailer.createTransport({
          service: process.env.SERVICE_EMAIL,
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
          },
        })
        let message = {
          from: process.env.USER_EMAIL,
          to: email,
          subject: "Confirme sua conta na Soddu",
          html: `
          <h4>Olá, ${name}, bem-vindo a SODDU</h4>
          <h4>Login: ${login}</h4>
          <h4>Senha: ${password}</h4>
          <span>Você poderá alterar essa senha depois.</span>
          <p>Agora, é só você ativar a conta clicando no botão
          abaixo antes de realizar o primeiro acesso.</p>
          <a style="background:#15d798;border-radius: 11px;padding:20px 45px;color:#ffffff;display: inline-block;font-size:16px;font-family: sans-serif;text-align: center;" href="${url}/token/${token}">Ativar conta.</a>`,
        }
        tranporter.sendMail(message, function (error, info) {
          if (error) {
            console.log(error)
            res.send(error)
          } else {
            res.redirect("/admin/settings")
          }
        })
      })
      .catch((erro) => {
        res.send("Error ao realizar o Cadastrado" + erro)
      })
  },
  GetTokenEmail(req, res) {
    const token = req.params.token
    Admin.findOne({ where: { token: token } }).then((admin) => {
      if (admin != undefined) {
        res.render("admin/confirmation", { admin: admin.toJSON() })
      } else {
        res.send("Token inválido ou e-mail já confirmado.")
      }
    })
  },
  PostTokenEmail(req, res) {
    const id = req.body.id
    Admin.update(
      {
        token: null,
        confirmation: true,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      req.flash("success_msg", alert.CONFIRMATION_EMAIL)
      res.redirect("/")
    })
  },
  GetDeleteAdmin(req, res) {
    const id = req.body.id
    if (id != undefined) {
      if (!isNaN(id)) {
        Admin.destroy({
          where: {
            id: id,
          },
        }).then(() => {
          res.redirect("/admin/settings")
        })
      } else {
        res.redirect("/admin/settings")
      }
    } else {
      res.redirect("/admin/settings")
    }
  },
  PostUpdateAdmin(req, res) {
    const id = req.body.id
    const name = req.body.name
    const login = req.body.login
    const email = req.body.email
    const password = req.body.password
    const filter = req.body.filter
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    Admin.update(
      {
        name: name.toLowerCase(),
        login: login,
        email: email,
        password: hash,
        filter: filter,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/settings")
    })
  },
  PostLoginAdmin(req, res) {
    const login = req.body.login
    const password = req.body.password
    Admin.findOne({ where: { login: login } }).then((admin) => {
      if (admin != undefined) {
        var correct = bcrypt.compareSync(password, admin.password)
        var confirmation = admin.confirmation
        if (correct) {
          req.session.admin = {
            name: admin.name,
            login: admin.login,
            filter: admin.filter,
          }
          if (confirmation == true) {
            req.flash("success_msg", alert.LOGIN_SUCCESS)
            res.redirect("/admin/registrys")
          } else {
            req.flash("error_msg", alert.UNCONFIRMED_EMAIL)
            res.redirect("/")
          }
        } else {
          req.flash("error_msg", alert.INVALID_PASSWORD)
          res.redirect("/")
        }
      } else {
        req.flash("error_msg", alert.INVALID_LOGIN)
        res.redirect("/")
      }
    })
  },
  PostLogoutAdmin(req, res) {
    req.session.admin = undefined
    res.redirect("/")
  },
  GetResetPasswords(req, res) {
    res.render("admin/resetPassword")
  },
}

module.exports = AdminsController
