var Sequelize = require('sequelize');
require('dotenv').config();
const fs = require('fs');
var sequelizeTransforms = require('sequelize-transforms');

// const sequelizeInstance = new Sequelize('argelDB', 'root', 'mysql123', {
//     host: 'localhost',
//     port: '3306',
//     dialect: 'mysql',
//     //delete below code to enable logging
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     },
//     operatorsAliases: false
// });

const sequelizeInstance = new Sequelize({
    username: 'ja6bowk8jz182zhh3b8d',
    password: 'pscale_pw_oQ1Xl5cORiSEC5SYx4FEQdiZskoXnBVfrebXuksmWOl',
    database: 'argeldb',
    dialect: 'mysql',
    host: 'aws.connect.psdb.cloud', // Replace with your PlanetScale database hostname
    port: 3306, // PlanetScale uses the standard MySQL port
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false,
    dialectOptions: {
        ssl: {
          ca: (process.env.MYSQL_SSL_CA) // Replace with the actual path to the PlanetScale CA certificate
        },
      }
  });
  

sequelizeInstance.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

sequelizeTransforms(sequelizeInstance);


module.exports.sequelizeInstance = sequelizeInstance;
module.exports.Sequelize = Sequelize;