const Sequelize = require('sequelize');

const dbConfig = require('./db_Configuration.js');

const sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.password,{
    host: dbConfig.host,
    dialect: 'mysql',
    port: dbConfig.port,
    dialectOptions: {
        multipleStatement: true,
    }
});
const db = [];

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Product = require('./product.js');
db.products = new Product(sequelize);

const User = require('./user.js');
db.users = new User(sequelize);

const Cart = require('./cart.js');
db.carts = new Cart(sequelize);

module.exports = db;
