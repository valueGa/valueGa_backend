module.exports = (sequelize, Sequelize) => {
  const TEMPLATE = sequelize.define(
    'TEMPLATES',
    {
      template_name: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return TEMPLATE;
};
