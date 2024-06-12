module.exports = (sequelize, Sequelize) => {
  const FinanceInfo = sequelize.define('FINANCE_INFOS', {
    stock_id: {
      type: Sequelize.STRING(8),
      references: {
        model: 'STOCKS',
        key: 'stock_code',
      },
    },
    sr: {
      type: Sequelize.STRING(10),
    },
    cogs: {
      type: Sequelize.DECIMAL,
    },
    gnf: {
      type: Sequelize.STRING(10),
    },
    senae: {
      type: Sequelize.DECIMAL,
    },
    se: {
      type: Sequelize.STRING(10),
    },
    ae: {
      type: Sequelize.DECIMAL,
    },
    bde: {
      type: Sequelize.DECIMAL,
    },
    ci: {
      type: Sequelize.DECIMAL,
    },
    capex: {
      type: Sequelize.DECIMAL,
    },
    dna: {
      type: Sequelize.DECIMAL,
    },
    cs: {
      type: Sequelize.STRING(10),
    },
    lte: {
      type: Sequelize.DECIMAL,
    },
    ibt: {
      type: Sequelize.DECIMAL,
    },
    ni: {
      type: Sequelize.DECIMAL,
    },
    roe: {
      type: Sequelize.DOUBLE,
    },
    eps: {
      type: Sequelize.DOUBLE,
    },
    per: {
      type: Sequelize.DOUBLE,
    },
    bps: {
      type: Sequelize.DOUBLE,
    },
    pbr: {
      type: Sequelize.DECIMAL,
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
  });

  return FinanceInfo;
};
