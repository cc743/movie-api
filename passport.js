const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./model.js"),
  passportJWT = require("passport-jwt");

let UsersModel = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Passport strategy named LocalStrategy: defines basic HTTP authentication
 * for login requests
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      UsersModel.findOne({ username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("incorrect username");
          return callback(null, false, { message: "Incorrect username" });
        }

        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password" });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

/**
 * Passport strategy named JWTStrategy: authenticates users based on the JWT
 * submitted alongside the request. JWT Extracted from header of HTTP request,
 * secret key verifies signature of the JWT
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret"
    },
    (jwtPayload, callback) => {
      return UsersModel.findById(jwtPayload._id)
        .then(user => {
          return callback(null, user);
        })
        .catch(error => {
          return callback(error);
        });
    }
  )
);
