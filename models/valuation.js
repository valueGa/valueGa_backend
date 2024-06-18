module.exports = (sequelize, Sequelize) => {
  const VALUATION = sequelize.define(
    'VALUATIONS',
    {
      valuation_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stock_id: {
        type: Sequelize.STRING(6),
        references: {
          model: 'STOCKS',
          key: 'stock_id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'USERS',
          key: 'user_id',
        },
      },
      target_price: {
        type: Sequelize.INTEGER,
      },
      value_potential: {
        type: Sequelize.FLOAT,
      },
      current_price: {
        type: Sequelize.INTEGER,
      },
      is_temporary: {
        type: Sequelize.BOOLEAN,
      },
    },
    {
      freezeTableName: true,
      // hooks: {
      //   afterUpdate: async (valuation, options) => {
      //     if (
      //       valuation.changed('target_price') ||
      //       valuation.changed('value_potential')
      //     ) {
      //       await sequelize.models.CONSENSUS.update(
      //         {
      //           target_price: valuation.target_price,
      //           value_potential: valuation.value_potential,
      //         },
      //         { where: { stock_id: valuation.stock_id } }
      //       );
      //     }
      //   },
      // },
    }
  );

  return VALUATION;
};
