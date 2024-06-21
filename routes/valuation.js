const express = require('express');
const router = express.Router();

const { VALUATIONS, FINANCE_INFOS, STOCKS } = require('../models');
const { authenticateJWT } = require('./auth');

const { Op } = require('sequelize');

const multer = require('multer');
const fs = require('fs');
const path = require('path');

router.post('/init', async (req, res) => {
  /* 
    #swagger.description = 'valuation 생성시 3개년 데이터 가져오기'
    #swagger.tags = ['Valuations']
  */
  try {
    const { stock_id, years } = req.body;

    const financeInfos = await FINANCE_INFOS.findAll({
      where: {
        stock_id: stock_id,
        year: {
          [Op.in]: years,
        },
      },
    });

    const response = {};
    financeInfos.forEach((info) => {
      response[info.year] = info;
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'valuation 데이터 가져오기 실패' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './upload'));
  },
  filename: (req, file, cb) => {
    cb(null, `a.xlsx`);
  },
});

const excelFilePath = path.join(__dirname, `./upload/a.xlsx`);
const outputFilePath = path.join(__dirname, './upload/abx_binary.txt');
const upload = multer({ storage: storage });

router.post('/save', upload.single('file'), async (req, res) => {
  /*
        #swagger.description = 'user의 valuation 저장'
        #swagger.tags = ['Valuations']
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
    } */
  const { id } = req.query;

  const { user_id, target_price, value_potential } = req.body;
  const file = req.file;

  if (!file || !user_id || !id || !target_price || !value_potential) {
    return res.status(400).send({ message: '데이터가 비었어요' });
  }
  try {
    const fileContent = fs.readFileSync(excelFilePath);

    await VALUATIONS.create({
      user_id: user_id,
      stock_id: id,
      target_price: target_price,
      value_potential: value_potential,
      is_temporary: false,
      // current_price: current_price,
      excel_data: fileContent,
    });

    res.status(200).send({ message: '밸류에이션 저장 완료' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: '저장 중 에러' });
  }
});

router.post('/temporary-save', upload.single('file'), async (req, res) => {
  /*
        #swagger.description = 'user의 valuation 임시 저장'
        #swagger.tags = ['Valuations']
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
    } */
  const { id } = req.query;

  const { user_id, target_price, value_potential } = req.body;
  const file = req.file;

  if (!file || !user_id || !id || !target_price || !value_potential) {
    return res.status(400).send({ message: '데이터가 비었어요' });
  }

  try {
    const templateCount = await VALUATIONS.count({
      where: { user_id: user_id, is_temporary: true },
    });

    if (templateCount >= 3) {
      return res
        .status(400)
        .json({ message: '임시저장 개수는 최대 3개입니다!' });
    }

    const fileContent = fs.readFileSync(excelFilePath);
    await VALUATIONS.create({
      user_id: user_id,
      stock_id: id,
      target_price: target_price,
      value_potential: value_potential,
      is_temporary: true,
      // current_price: current_price,
      excel_data: fileContent,
    });
    res.status(200).send({ message: '임시저장 완료' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: '임시저장 중 에러' });
  }
});

router.delete('/delete', authenticateJWT, async (req, res) => {
  /*
        #swagger.description = 'user의 valuation 삭제'
        #swagger.tags = ['Valuations']
        #swagger.parameters['valuation_id'] = {
            in: 'body',
            type: 'string',
            required: 'true',
            description: '삭제할 valuation의 ID',
        } 
    */
  const { valuation_id } = req.body;

  if (!valuation_id) {
    return res.status(400).send({ message: 'valuation_id가 필요' });
  }

  const user_id = req.user.user_id; // 인증된 사용자의 user_id

  try {
    const valuation = await VALUATIONS.findOne({
      where: { valuation_id: valuation_id, user_id: user_id },
    });

    if (!valuation) {
      return res.status(404).send({ message: '밸류에이션을 찾을 수 없음' });
    }

    await VALUATIONS.destroy({
      where: { valuation_id: valuation_id },
    });

    res.status(200).send({ message: '밸류에이션 삭제 완료' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: '삭제 중 에러' });
  }
});

router.get('/valuations', authenticateJWT, async (req, res) => {
  /*
        #swagger.description = '사용자의 valuation 정보를 가져옴'
        #swagger.tags = ['Valuations']
    */

  const user_id = req.user.user_id; // 토큰에서 추출한 user_id

  try {
    const valuations = await VALUATIONS.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: STOCKS,
          attributes: ['stock_name'],
          required: true,
        },
      ],
    });

    const result = valuations.map((valuation) => ({
      valuation_id: valuation.valuation_id,
      stock_name: valuation.STOCK.stock_name,
      target_price: valuation.target_price,
      value_potential: valuation.value_potential,
      date: valuation.createdAt,
      is_temporary: valuation.is_temporary,
    }));

    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '밸류에이션 정보 가져오기 중 에러' });
  }
});

router.get('/download/:id', async (req, res) => {
  // #swagger.description = 'user의 Valuation 다운로드'
  // #swagger.tags = ['Valuations']
  try {
    const id = req.params.id;
    const valuation = await VALUATIONS.findByPk(id);

    if (!valuation) {
      return res.status(404).send({ message: '템플릿 없음' });
    }

    const binaryContent = valuation.excel_data;

    const outputPath = path.join(__dirname, `./upload/restored_a.xlsx`);
    fs.writeFileSync(outputPath, binaryContent);

    res.download(outputPath, 'restored_a.xlsx', (err) => {
      if (err) {
        res.status(500).send({ message: '파일 전송 중 에러' });
      } else {
        console.log('파일 전송 완료');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '파일 다운로드 중 에러' });
  }
});

router.put('/:valuation_id', upload.single('file'), async (req, res) => {
  /*
        #swagger.description = 'user의 valuation 수정'
        #swagger.tags = ['Valuations']
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
    } */
  const { valuation_id } = req.params;
  const { user_id, target_price, value_potential } = req.body;
  const file = req.file;

  console.log(valuation_id);

  if (!file || !user_id || !target_price || !value_potential) {
    return res.status(400).send({ message: '데이터가 비었어요' });
  }

  try {
    const existingValuation = await VALUATIONS.findOne({
      where: {
        valuation_id: valuation_id,
        user_id: user_id,
      },
    });

    if (existingValuation) {
      const fileContent = fs.readFileSync(file.path);

      await VALUATIONS.update(
        {
          target_price: target_price,
          value_potential: value_potential,
          excel_data: fileContent,
          is_temporary: false,
        },
        {
          where: {
            valuation_id: valuation_id,
            user_id: user_id,
            is_temporary: existingValuation.is_temporary,
          },
        }
      );

      res.status(200).send({ message: '밸류에이션 업데이트 완료' });
    } else {
      return res
        .status(404)
        .send({ message: '존재하지 않는 밸류에이션입니다.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: '업데이트 중 에러' });
  }
});

router.put(
  '/:valuation_id/temporary',
  upload.single('file'),
  async (req, res) => {
    /*
        #swagger.description = 'user의 valuation 임시 수정'
        #swagger.tags = ['Valuations']
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
    } */
    const { valuation_id } = req.params;
    const { user_id, target_price, value_potential } = req.body;
    const file = req.file;

    if (!file || !user_id || !target_price || !value_potential) {
      return res.status(400).send({ message: '데이터가 비었어요' });
    }

    try {
      const existingValuation = await VALUATIONS.findOne({
        where: {
          valuation_id: valuation_id,
          user_id: user_id,
        },
      });

      if (existingValuation) {
        const fileContent = fs.readFileSync(file.path);

        await VALUATIONS.update(
          {
            target_price: target_price,
            value_potential: value_potential,
            excel_data: fileContent,
            is_temporary: true, // 명시적으로 true로 설정
          },
          {
            where: {
              valuation_id: valuation_id,
              user_id: user_id,
              is_temporary: existingValuation.is_temporary, // 명시적으로 true로 설정
            },
          }
        );

        res.status(200).send({ message: '임시저장 업데이트 완료' });
      } else {
        return res
          .status(404)
          .send({ message: '존재하지 않는 임시 밸류에이션입니다.' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: '임시저장 업데이트 중 에러' });
    }
  }
);

// 특정 valuationId에 대한 엑셀 데이터 가져오기
router.get('/:id', async (req, res) => {
  /*
      #swagger.description = '특정 valuationId에 대한 엑셀 데이터 가져오기'
      #swagger.tags = ['Valuations']
      #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          required: 'true',
          description: 'Valuation ID'
      }
  */
  const { id } = req.params;

  try {
    const valuation = await VALUATIONS.findOne({
      where: { valuation_id: id },
      include: [
        {
          model: STOCKS,
          attributes: ['stock_name'],
        },
      ],
    });

    if (valuation) {
      res.status(200).send({
        valuation: {
          excel_data: valuation.excel_data,
          target_price: valuation.target_price,
          value_potential: valuation.value_potential,
        },
        stock_name: valuation.STOCK ? valuation.STOCK.stock_name : null,
      });
    } else {
      res.status(404).send({ message: '데이터를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '데이터를 가져오는 중 에러 발생' });
  }
});

module.exports = router;
