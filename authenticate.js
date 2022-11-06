const jwt = require("jsonwebtoken");

const { TokenExpiredError } = jwt;
const catchTokenExpiredError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized ! Access Token was Expired" });
  }
  return res.status(401).send({ message: "Unauthorized!" });
};

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).send({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provides!",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return catchTokenExpiredError(err, res);
    }
    req.id = decoded.id;
    next();
  });
};

module.exports = protect;
