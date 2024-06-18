module.exports = (sequelize, Sequelize) => {
  const STOCK = sequelize.define(
    'STOCKS',
    {
      stock_id: {
        type: Sequelize.STRING(6),
        primaryKey: true,
      },
      stock_name: {
        type: Sequelize.STRING(20),
      },
      target_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return STOCK;
};
