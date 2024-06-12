module.exports = (sequelize, Sequelize) => {
  const STOCK = sequelize.define(
    'STOCKS',
    {
      stock_code: {
        type: Sequelize.CHAR(8),
        primaryKey: true,
      },
      stock_name: {
        type: Sequelize.STRING(20),
      },
    },
    {
      freezeTableName: true,
    }
  );

  return STOCK;
};
