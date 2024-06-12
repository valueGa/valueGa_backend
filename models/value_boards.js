module.exports = (sequelize, Sequelize) => {
  const ValueBoard = sequelize.define(
    'VALUE_BOARDS',
    {
      stock_id: {
        type: Sequelize.STRING(8),
        references: {
          model: 'STOCKS',
          key: 'stock_code',
        },
      },
      user_id: {
        type: Sequelize.STRING(30),
        references: {
          model: 'USERS',
          key: 'email',
        },
      },
      posted_date: {
        type: Sequelize.DATE,
      },
      target_price: {
        type: Sequelize.INTEGER,
      },
      value_potential: {
        type: Sequelize.STRING(10),
      },
    },
    {
      freezeTableName: true,
    }
  );

  return ValueBoard;
};
