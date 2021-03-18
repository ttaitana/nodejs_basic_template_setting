const passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportJWT = require("passport-jwt"),
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt,
  db = require("../configs/database"),
  UserModel = db.user
userTools = require("../util/userTools")

//todo: set expire time

//?user login authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, cb) => {
      //? this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT

      return UserModel.findOne({
        where: { username },
        raw: true,
      })
        .then(async (user) => {
          //? Is user exits
          if (!user) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            })
          }
          //? Check user status
          if (user.user_status === "pending") {
            return cb(null, false, {
              message: "User is not authenticate yet.",
            })
          }
          matching = await userTools.comparePassword(password, user.password)
          if (matching) {
            return cb(
              null,
              {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                user_stats: user.user_stats,
              },
              { message: "Logged In Successfully" }
            )
          }
          return cb(null, false, {
            message: "Incorrect username or password.",
          })
        })
        .catch((err) => cb(err))

      //! this one is for mocking data
      if (username !== user.username)
        return cb(null, false, { message: "Incorrect username or password." })

      return cb(null, user, { message: "Logged In Successfully" })
    }
  )
)

//? User get data authentication
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, cb) => {
      console.log(`🚀 --------------------------------------------------------`)
      console.log(`🚀 ~ file: passport.js ~ line 70 ~ jwtPayload`, jwtPayload)
      console.log(`🚀 --------------------------------------------------------`)
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

      //!   Use this one when connect to db
      return UserModel.findOne({
        where: { id: jwtPayload.id },
        attributes: { exclude: ["password"] },
      })
        .then((user) => {
          return cb(null, user)
        })
        .catch((err) => {
          return cb(err)
        })

      //! Just for test
      try {
        // find the user in db if needed
        if (jwtPayload.id == user.id) {
          return cb(null, user)
        } else {
          return cb(null, false)
        }
      } catch (error) {
        return cb(error, false)
      }
    }
  )
)
