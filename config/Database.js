const mysql = require("mysql");
const { Sequelize } = require("sequelize");
const db = new Sequelize("my_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
