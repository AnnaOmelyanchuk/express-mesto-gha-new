const router = require('express').Router();

const {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
} = require('../controllers/users');

const {
  auth,
} = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUser);
router.get('/users/:userId', auth, getUserById);
// router.post('/users', createUser);
router.patch('/users/me', auth, updateUserInfo);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
