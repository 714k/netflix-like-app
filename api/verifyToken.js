const  jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.token;

  if(authHeader) {
    const [, token] = authHeader.split(" ");

    jwt.verify(token, process.env.SECRET_KEY_JWT, (error, user) => {
      if(error) {
        res.status(403).json("Token is not valid");
      }

      req.user = user;

      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
}

module.exports = verify;