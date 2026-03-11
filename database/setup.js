// setup.js
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const storage =
  env === "production" ? process.env.PROD_DB_STORAGE : process.env.DEV_DB_STORAGE;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storage,
  logging: false
});

const Track = sequelize.define("Track", {
  trackId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  songTitle: { type: DataTypes.STRING, allowNull: false },
  artistName: { type: DataTypes.STRING, allowNull: false },
  albumName: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER },
  releaseYear: { type: DataTypes.INTEGER }
});

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync();
    console.log("Tables created.");
  } catch (error) {
    console.error(error);
  }
}

// Only run setup if file is run directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { sequelize, Track };