module.exports = (sequelize, Sequelize) => {
  const CONSENSUS = sequelize.define(
    'CONSENSUSES',
    {
      consensus_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      target_price: {
        type: Sequelize.INTEGER,
      },
      value_potential: {
        type: Sequelize.FLOAT,
      },
      excel_data: {
        type: Sequelize.JSON,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return CONSENSUS;
};
