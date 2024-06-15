module.exports = (sequelize, Sequelize) => {
  const STOCK = sequelize.define(
    'STOCKS',
    {
      stock_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      stock_name: {
        type: Sequelize.STRING(20),
      },
      target_price: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return STOCK;
};
