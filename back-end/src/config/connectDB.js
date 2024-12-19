const { Sequelize } = require('sequelize');
require('dotenv').config();
// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'music',
//   process.env.DB_USER || 'root',
//   process.env.DB_PASSWORD || null,
//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
//     logging: false,
//     port: 3306,
//   },
// );
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  port: 3306,
});
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
export default connectDB;
