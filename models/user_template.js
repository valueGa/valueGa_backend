module.exports = (sequelize, Sequelize) => {
  const USER_TEMPLATE = sequelize.define(
    'USER_TEMPLATES',
    {
      user_id: {
        type: Sequelize.STRING(30),
        references: {
          model: 'USERS', // 모델 이름을 대문자로 사용
          key: 'email',
        },
      },
      stock_id: {
        type: Sequelize.STRING(8),
        references: {
          model: 'STOCKS', // 모델 이름을 대문자로 사용
          key: 'stock_code',
        },
      },
      temp_data: {
        type: Sequelize.BLOB('long'), // Sequelize.BYTEA 대신 Sequelize.BLOB 사용
      },
    },
    {
      freezeTableName: true,
    }
  );

  return USER_TEMPLATE;
};
