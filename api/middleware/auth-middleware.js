const { findBy } = require("../auth/users-model");

const usernameExists = async (req, res, next) => {
  const user = await findBy({ username: req.body.username }).first();
  if (user) {
    res.status(401).json({ message: "username taken" });
    return;
  } else {
    next();
  }
};

const validatePost = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({ message: "username and password required" });
    return;
  } else {
    next();
  }
};

module.exports = {
  usernameExists,
  validatePost,
};
