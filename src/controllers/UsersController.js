const User = require("../models/User")
const bcrypt = require("bcryptjs")
const mailer = require("nodemailer")
const crypto = require("crypto")
const alert = require("../middlewares/alert")
const UsersController = {
  GetFindAllUsers(req, res) {
    User.findAll().then((user) => {
      res.render("admin/user/users", {
        user: user.map((user) => user.toJSON()),
      })
    })
  },

  GetUpdateUser(req, res) {
    const id = req.params.id
    User.findByPk(id).then((user) => {
      if (user != undefined) {
        res.render("admin/user/update", { user: user.toJSON() })
      } else {
        res.redirect("/admin/settings")
      }
    })
  },

  PostCreateUser(req, res) {
    const name = req.body.name
    const login = req.body.login
    const email = req.body.email
    const password = crypto.randomBytes(2).toString("hex")
    const filter = req.body.filter
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const url = process.env.PUBLIC_URL
    const token = crypto.randomBytes(64).toString("hex")

    User.create({
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
    User.findOne({ where: { token: token } }).then((user) => {
      if (user != undefined) {
        res.render("admin/confirmation", { user: user.toJSON() })
      } else {
        res.send("Token inválido ou e-mail já confirmado.")
      }
    })
  },
  PostTokenEmail(req, res) {
    const id = req.body.id
    User.update(
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
  GetDeleteUser(req, res) {
    const id = req.body.id
    if (id != undefined) {
      if (!isNaN(id)) {
        User.destroy({
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
  PostUpdateUser(req, res) {
    const id = req.body.id
    const name = req.body.name
    const login = req.body.login
    const email = req.body.email
    const password = req.body.password
    const filter = req.body.filter
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    User.update(
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
  PostLoginUser(req, res) {
    const login = req.body.login
    const password = req.body.password
    User.findOne({ where: { login: login } }).then((user) => {
      if (user != undefined) {
        var correct = bcrypt.compareSync(password, user.password)
        var confirmation = user.confirmation
        if (correct) {
          req.session.user = {
            name: user.name,
            login: user.login,
            filter: user.filter,
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
  PostLogoutUser(req, res) {
    req.session.user = undefined
    res.redirect("/")
  },
  GetResetPasswords(req, res) {
    res.render("admin/resetPassword")
  },
}

module.exports = UsersController
