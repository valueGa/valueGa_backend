module.exports = (sequelize, Sequelize) => {
  const USER = sequelize.define(
    'USERS',
    {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_email: {
        type: Sequelize.STRING(30),
      },
      user_password: {
        type: Sequelize.STRING(20),
      },
      user_name: {
        type: Sequelize.STRING(10),
      },
    },
    {
      freezeTableName: true,
    }
  );

  return USER;
};
