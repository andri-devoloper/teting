const { Sequelize } = require("sequelize");

const db = require("../config/Database");

const { DataTypes } = Sequelize;

const Product = db.define(
  "product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Product;

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully");

    // Sinkronisasi model dengan database
    await db.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Failed to sync database:", error);
  }
})();
