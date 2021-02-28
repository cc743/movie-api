/**
 * must be the same key used in JWT strategy
 */
const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

/**
 * the local passport file
 */
require("./passport");

/**
 * function used to generate token, set expiration date, and algo used to
 * "sign", or encode, the values of the JWT strategy
 * @param user
 */
let generateJWTToken = user => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, //this is the username you're encoding in the JWT
    expiresIn: "7d", //this specifies that the token will expire in 7 days
    algorithm: "HS256" //this is the algorithm used to "sign" or encode the values of the JWT
  });
};

/**
 * api call to the login endpoint which authenticates user after entering credentials
 * @param router
 */
module.exports = router => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      console.log(user);
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user
        });
      }
      req.login(user, { session: false }, error => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
