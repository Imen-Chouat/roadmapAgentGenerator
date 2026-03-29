import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('User route is working');
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, userController.getUserInfo);  // was missing authMiddleware
router.get('/roadmaps', authMiddleware, userController.getUserRoadmaps);
router.get('/all', userController.getAllUsers);
router.get('/allWithRoadmaps', userController.getAllUsersWithRoadmaps);
router.delete('/delete', authMiddleware, userController.deleteUser);
router.put('/update', authMiddleware, userController.updateUser);
router.put('/changePassword', authMiddleware, userController.changePassword);

export default router;
