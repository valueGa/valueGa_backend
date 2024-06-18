const express = require('express');
const router = express.Router();
const { USERS } = require('../models');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

router.post('/register', async (req, res) => {
  // #swagger.description = 'user의 회원가입'
  // #swagger.tags = ['Authentication']
  const { user_email, user_password, user_name } = req.body;

  try {
    const existingUser = await USERS.findOne({ where: { user_email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const user = await USERS.create({
      user_email,
      user_password: hashedPassword,
      user_name,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '회원 가입 실패' });
  }
});

router.post('/login', async (req, res) => {
  // #swagger.description = 'user의 로그인'
  // #swagger.tags = ['Authentication']
  const { user_email, user_password } = req.body;

  try {
    const currentUser = await USERS.findOne({
      where: { user_email },
    });

    if (!currentUser) {
      return res.status(401).json({ message: '없는 이메일' });
    }

    const isValidPassword = await bcrypt.compare(
      user_password,
      currentUser.user_password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: '없는 비밀번호' });
    }

    const token = jwt.sign({ user_id: currentUser.user_id }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '로그인 실패' });
  }
});

router.get('/logout', async (req, res) => {
  // #swagger.description = 'user의 로그아웃'
  // #swagger.tags = ['Authentication']
  res.json({ message: '로그아웃 성공' });
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.auth && req.headers.auth.split(' ')[1];

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get('/protected', authenticateJWT, (req, res) => {
  // #swagger.description = 'user의 접근 권한 확인'
  // #swagger.tags = ['Authentication']
  res.json({ message: '접근 성공' });
});

module.exports = { authenticateJWT };
module.exports.default = router;
