const db = require("../../data/dbConfig");

function findById(id) {
  return db("users").where("id", id).first();
}

async function add(user) {
  let userId = await db.insert(user);
  console.log(userId);
  return findById(userId);
}

module.exports = {
  findById,
  add,
};
