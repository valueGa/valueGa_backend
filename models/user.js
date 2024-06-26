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
        unique: true,
        allowNull: false,
      },
      user_password: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
