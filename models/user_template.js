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
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
      },
      stock_id: {
        type: Sequelize.STRING(6),
        references: {
          model: 'STOCKS',
          key: 'stock_id',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
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
