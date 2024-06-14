module.exports = (sequelize, Sequelize) => {
  const TEMPLATE = sequelize.define(
    'TEMPLATES',
    {
      template_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
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
