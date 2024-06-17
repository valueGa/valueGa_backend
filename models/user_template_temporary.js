module.exports = (sequelize, Sequelize) => {
  const USER_TEMPLATE_TEMPORARY = sequelize.define(
    'USER_TEMPLATE_TEMPORARIES',
    {
      template_tmp_id: {
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
      template_name: {
        type: Sequelize.STRING(20),
      },
      excel_data: {
        type: Sequelize.BLOB,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return USER_TEMPLATE_TEMPORARY;
};
