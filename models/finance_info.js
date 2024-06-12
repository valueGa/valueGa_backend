module.exports = (sequelize, Sequelize) => {
  const FINANCE_INFO = sequelize.define(
    'FINANCE_INFOS',
    {
      stock_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'STOCKS',
          key: 'stock_id',
        },
      },
      year: {
        type: Sequelize.DATE,
      },
      sr: {
        type: Sequelize.STRING(10),
      },
      npcf: {
        type: Sequelize.DECIMAL,
      },
      gpf: {
        type: Sequelize.STRING(10),
      },
      sense: {
        type: Sequelize.DECIMAL,
      },
      se: {
        type: Sequelize.STRING(10),
      },
      ar: {
        type: Sequelize.DECIMAL,
      },
      bais: {
        type: Sequelize.DECIMAL,
      },
      oi: {
        type: Sequelize.DECIMAL,
      },
      capex: {
        type: Sequelize.DECIMAL,
      },
      dnp: {
        type: Sequelize.DECIMAL,
      },
      as: {
        type: Sequelize.STRING(10),
      },
      re: {
        type: Sequelize.DECIMAL,
      },
      lbt: {
        type: Sequelize.DECIMAL,
      },
      rd: {
        type: Sequelize.DECIMAL,
      },
      roe: {
        type: Sequelize.DOUBLE,
      },
      eps: {
        type: Sequelize.DOUBLE,
      },
      bps: {
        type: Sequelize.DOUBLE,
      },
      evebitda: {
        type: Sequelize.STRING(10),
      },
      dr: {
        type: Sequelize.STRING(10),
      },
      rr: {
        type: Sequelize.STRING(10),
      },
    },
    {
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['stock_id', 'year'],
        },
      ],
    }
  );

  return FINANCE_INFO;
};
