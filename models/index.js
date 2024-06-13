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
// db.FINANCE_INFOS = require('./finance_info')(sequelize, Sequelize);
db.STOCKS = require('../models/stock')(sequelize, Sequelize);
db.TEMPLATES = require('../models/template')(sequelize, Sequelize);
db.USER_TEMPLATES = require('../models/user_template')(sequelize, Sequelize);
db.VALUE_BOARDS = require('../models/value_boards')(sequelize, Sequelize);
db.USER_TEMPLATE_TEMPORARIES = require('../models/user_template_temporary')(
  sequelize,
  Sequelize
);

db.USERS.hasMany(db.VALUE_BOARDS, { foreignKey: 'user_id' });
db.VALUE_BOARDS.belongsTo(db.USERS, { foreignKey: 'user_id' });

db.USERS.hasMany(db.USER_TEMPLATES, { foreignKey: 'user_id' });
db.USER_TEMPLATES.belongsTo(db.USERS, { foreignKey: 'user_id' });

db.USERS.hasMany(db.USER_TEMPLATE_TEMPORARIES, { foreignKey: 'user_id' });
db.USER_TEMPLATE_TEMPORARIES.belongsTo(db.USERS, { foreignKey: 'user_id' });

db.STOCKS.hasMany(db.VALUE_BOARDS, { foreignKey: 'stock_id' });
db.VALUE_BOARDS.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

db.STOCKS.hasMany(db.USER_TEMPLATES, { foreignKey: 'stock_id' });
db.USER_TEMPLATES.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

db.STOCKS.hasMany(db.USER_TEMPLATE_TEMPORARIES, { foreignKey: 'stock_id' });
db.USER_TEMPLATE_TEMPORARIES.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

// db.STOCKS.hasMany(db.FINANCE_INFOS, { foreignKey: 'stock_id' });
// db.FINANCE_INFOS.belongsTo(db.STOCKS, { foreignKey: 'stock_id' });

db.TEMPLATES.hasMany(db.VALUE_BOARDS, { foreignKey: 'template_id' });
db.VALUE_BOARDS.belongsTo(db.TEMPLATES, { foreignKey: 'template_id' });

module.exports = db;
