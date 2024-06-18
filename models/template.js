module.exports = (sequelize, Sequelize) => {
  const TEMPLATE = sequelize.define(
    'TEMPLATES',
    {
      template_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      template_name: {
        type: Sequelize.STRING(20),
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'USERS',
          key: 'user_id',
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

  return TEMPLATE;
};
