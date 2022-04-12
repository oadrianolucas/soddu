const router = require("express").Router()
const registrysController = require("./controllers/RegistrysController")
const usersController = require("./controllers/UsersController")
const schoolsController = require("./controllers/SchoolsController")
const login = require("./middlewares/login")
const filter = require("./middlewares/filter")

router.get("/", (req, res) => {
  res.render("admin/login")
})

router.get("/admin/schools", filter, schoolsController.GetFindAllSchools)

router.get(
  "/admin/school/update/:id",
  filter,
  schoolsController.GetUpdateSchool
)

router.post("/create/school", filter, schoolsController.PostCreateSchool)

router.post("/delete/school", filter, schoolsController.PostDeleteSchool)

router.post("/update/school", filter, schoolsController.PostUpdateSchool)

router.get("/admin/registrys", login, registrysController.GetFindAllRegistrys)

router.get(
  "/admin/registry/create",
  filter,
  registrysController.GetCreateRegistry
)

router.get(
  "/admin/registry/view/:id",
  filter,
  registrysController.GetViewRegistry
)

router.get(
  "/admin/registry/update/:id",
  filter,
  registrysController.GetUpdateRegistry
)

router.get(
  "/admin/registrys/search",
  filter,
  registrysController.GetSearchRegistrys
)

router.post("/create/registry", filter, registrysController.PostCreateRegistry)

router.post("/delete/registry", filter, registrysController.PostDeleteRegistry)

router.post("/update/registry", filter, registrysController.PostUpdateRegistry)

router.get("/admin/settings", filter, usersController.GetFindAllUsers)

router.get("/admin/user/update/:id", filter, usersController.GetUpdateUser)

router.get("/reset/password", usersController.GetResetPasswords)

router.get("/token/:token", usersController.GetTokenEmail)

router.post("/verify/token", usersController.PostTokenEmail)

router.post("/authenticate", usersController.PostLoginUser)

router.post("/logout", usersController.PostLogoutUser)

router.post("/create/user", filter, usersController.PostCreateUser)

router.post("/delete/user", filter, usersController.GetDeleteUser)

router.post("/update/user", filter, usersController.PostUpdateUser)

router.use((req, res) => {
  res.status(404)
  res.render("404")
})
module.exports = router
