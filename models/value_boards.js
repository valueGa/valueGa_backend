module.exports = (sequelize, Sequelize) => {
  const VALUE_BOARD = sequelize.define(
    'VALUE_BOARDS',
    {
      board_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stock_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'STOCKS',
          key: 'stock_id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'USERS',
          key: 'user_id',
        },
      },
      template_id: {
        type: Sequelize.STRING(20),
        references: {
          model: 'TEMPLATES',
          key: 'template_id',
        },
      },
      created_date: {
        type: Sequelize.DATE,
      },
      updated_date: {
        type: Sequelize.DATE,
      },
      target_price: {
        type: Sequelize.INTEGER,
      },
      value_potential: {
        type: Sequelize.FLOAT,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return VALUE_BOARD;
};
