const jwt = require("jsonwebtoken");

const tokenGeneration = (uid, role) =>
  jwt.sign(
    {
      _id: uid,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );

const tokenRefreshGeneration = (uid) =>
  jwt.sign(
    {
      _id: uid,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

module.exports = {
  tokenGeneration,
  tokenRefreshGeneration,
};
