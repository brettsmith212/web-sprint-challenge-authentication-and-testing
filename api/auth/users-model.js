const db = require("../../data/dbConfig");

function findBy(filter) {
  return db("users").where(filter);
}

function findById(id) {
  return db("users").where("id", id).first();
}

async function add(user) {
  let [id] = await db("users").insert(user);
  return findById(id);
}

module.exports = {
  findBy,
  findById,
  add,
};
