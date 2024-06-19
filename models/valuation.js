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
      excel_data: {
        type: Sequelize.BLOB,
      },
    },
    {
      freezeTableName: true,
      hooks: {
        afterCreate: async (valuation, options) => {
          const { stock_id } = valuation;

          const { targetPriceAvg, valuePotentialAvg } = await VALUATION.findAll(
            {
              where: { stock_id, is_temporary: false },
              attributes: [
                [
                  Sequelize.cast(
                    Sequelize.fn('AVG', Sequelize.col('target_price')),
                    'DECIMAL(10,2)'
                  ),
                  'target_price_avg',
                ],
                [
                  Sequelize.cast(
                    Sequelize.fn('AVG', Sequelize.col('value_potential')),
                    'DECIMAL(10,2)'
                  ),
                  'value_potential_avg',
                ],
              ],
              raw: true,
            }
          ).then((result) => {
            return {
              targetPriceAvg: result[0].target_price_avg,
              valuePotentialAvg: result[0].value_potential_avg,
            };
          });

          if (targetPriceAvg != null) {
            // 동일한 stock_id를 가진 CONSENSUSES 정보 업데이트
            await sequelize.models.CONSENSUSES.update(
              {
                target_price: parseInt(targetPriceAvg),
                value_potential: parseFloat(valuePotentialAvg).toFixed(2),
              },
              { where: { stock_id } }
            );
          }
        },

        afterUpdate: async (valuation, options) => {
          //임시저장 -> 저장을 바뀌는 경우를 감지해서 Update
          const { stock_id, is_temporary } = valuation;
          if (!is_temporary) {
            const { targetPriceAvg, valuePotentialAvg } =
              await VALUATION.findAll({
                where: { stock_id },
                attributes: [
                  [
                    Sequelize.cast(
                      Sequelize.fn('AVG', Sequelize.col('target_price')),
                      'DECIMAL(10,2)'
                    ),
                    'target_price_avg',
                  ],
                  [
                    Sequelize.cast(
                      Sequelize.fn('AVG', Sequelize.col('value_potential')),
                      'DECIMAL(10,2)'
                    ),
                    'value_potential_avg',
                  ],
                ],
                raw: true,
              }).then((result) => {
                return {
                  targetPriceAvg: result[0].target_price_avg,
                  valuePotentialAvg: result[0].value_potential_avg,
                };
              });

            await sequelize.models.CONSENSUSES.update(
              {
                target_price: parseInt(targetPriceAvg),
                value_potential: parseFloat(valuePotentialAvg).toFixed(2),
              },
              { where: { stock_id } }
            );
          }
        },
      },
    }
  );

  return VALUATION;
};
