module.exports = (sequelize, Sequelize) => {
  const USER_TEMPLATE = sequelize.define(
    'USER_TEMPLATES',
    {
      template_name: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'USERS',
          key: 'user_id',
        },
      },
      stock_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'STOCKS',
          key: 'stock_id',
        },
      },
      created_date: {
        type: Sequelize.DATE,
      },
      excel_data: {
        type: Sequelize.BLOB,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return USER_TEMPLATE;
};
