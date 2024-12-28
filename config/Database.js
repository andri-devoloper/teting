const mysql = require("mysql");
const { Sequelize } = require("sequelize");
const db = new Sequelize("api", "newuser", "newpassword123!", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
