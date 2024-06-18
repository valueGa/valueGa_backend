module.exports = (sequelize, Sequelize) => {
  const FINANCE_INFO = sequelize.define(
    'FINANCE_INFOS',
    {
      stock_id: {
        type: Sequelize.STRING(6),
        references: {
          model: 'STOCKS',
          key: 'stock_id',
        },
      },
      year: {
        type: Sequelize.INTEGER,
      },
      ep: {
        type: Sequelize.DOUBLE,
      },
      el: {
        type: Sequelize.DOUBLE,
      },
      se: {
        type: Sequelize.DOUBLE,
      },
      fl: {
        type: Sequelize.DOUBLE,
      },
      fp: {
        type: Sequelize.DOUBLE,
      },
      ite: {
        type: Sequelize.DOUBLE,
      },
      sr: {
        type: Sequelize.DOUBLE,
      },
      oi: {
        type: Sequelize.DOUBLE,
      },
      ibt: {
        type: Sequelize.DOUBLE,
      },
      fpl: {
        type: Sequelize.DOUBLE,
      },
      epl: {
        type: Sequelize.DOUBLE,
      },
      rr: {
        type: Sequelize.FLOAT,
      },
      dr: {
        type: Sequelize.FLOAT,
      },
      evebitda: {
        type: Sequelize.FLOAT,
      },
      roe: {
        type: Sequelize.FLOAT,
      },
      bps: {
        type: Sequelize.FLOAT,
      },
      ni: {
        type: Sequelize.FLOAT,
      },
      ts: {
        type: Sequelize.DOUBLE,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
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
