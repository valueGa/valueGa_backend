const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,

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
db.FINANCE_INFOS = require('./finance_infos')(sequelize, Sequelize);
db.STOCKS = require('../models/stock')(sequelize, Sequelize);
db.TEMPLATES = require('../models/template')(sequelize, Sequelize);
db.CONSENSUSES = require('./consensus')(sequelize, Sequelize);
db.VALUATIONS = require('./valuation')(sequelize, Sequelize);

db.USERS.hasMany(db.VALUATIONS, { foreignKey: 'user_id' });
db.VALUATIONS.belongsTo(db.USERS, { foreignKey: 'user_id' });

db.USERS.hasMany(db.TEMPLATES, { foreignKey: 'user_id' });
db.TEMPLATES.belongsTo(db.USERS, { foreignKey: 'user_id' });

db.STOCKS.hasMany(db.VALUATIONS, { foreignKey: 'stock_id' });
db.VALUATIONS.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

db.STOCKS.hasMany(db.FINANCE_INFOS, { foreignKey: 'stock_id' });
db.FINANCE_INFOS.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

db.STOCKS.hasOne(db.CONSENSUSES, { foreignKey: 'stock_id' });
db.CONSENSUSES.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log('DB 연결 완료');
});

module.exports = db;
