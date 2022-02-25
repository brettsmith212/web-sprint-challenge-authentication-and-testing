module.exports = {
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 12,
  JWT_SECRET: process.env.JWT_SECRET || "secret password",
};
