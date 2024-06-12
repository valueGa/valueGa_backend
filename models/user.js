module.exports = (sequelize, Sequelize) => {
  const USER = sequelize.define(
    'USERS',
    {
      email: {
        type: Sequelize.STRING(30),
        primaryKey: true,
      },
      user_password: {
        type: Sequelize.STRING(50),
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
