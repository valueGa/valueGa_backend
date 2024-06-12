const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.USERS = require('../models/user')(sequelize, Sequelize);
db.FINANCE_INFOS = require('../models/finance_infos')(sequelize, Sequelize);
db.STOCKS = require('../models/stock')(sequelize, Sequelize);
db.TEMPLATES = require('../models/template')(sequelize, Sequelize);
db.USER_TEMPLATES = require('../models/user_template')(sequelize, Sequelize);
db.VALUE_BOARDS = require('../models/value_boards')(sequelize, Sequelize);
module.exports = db;
